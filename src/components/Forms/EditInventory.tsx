import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useEditInventoryMutation,
  useReadRequestQuery,
} from '../../api/apiHandler';
import { EditInventoryProps, SendEditData } from '../../models/datamodels';
import { toast } from 'react-toastify';
const EditInventory: React.FC<EditInventoryProps> = ({
  editElement,
  handleCloseEdit,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);

  const handleClose = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleCloseEdit(e);
  };

  const form = useForm<SendEditData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { data: bloodGroups } = useReadRequestQuery('bloodgroups');

  console.log(bloodGroups);

  const [editInventory] = useEditInventoryMutation();

  const onSubmit = async (editData: SendEditData) => {
    setLoading(true);
    const modifiedData = { ...editElement };
    if (!modifiedData.quantity) {
      modifiedData.quantity = 0;
    }
    editData.inventoryId = modifiedData.inventoryId;
    editData.hospitalId = modifiedData.hospitalId;
    editData.inventoryName = modifiedData.inventoryName;
    editData.bloodGroupId = modifiedData.bloodGroupId;
    {
      add
        ? (editData.quantity =
            Number(editData.quantity) + Number(modifiedData.quantity))
        : (editData.quantity = modifiedData.quantity - editData.quantity);
    }
    try {
      await editInventory(editData);
      toast.success("Inventory item edited")
    } catch (error) {
      toast.error("Couldnot edit inventory item")
    }
    setLoading(false);
    handleClose();
  };
  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#0000007A] z-50">
      <form
        className="w-full md:w-1/3 h-3/4 bg-white flex flex-col justify-between items-center p-4 md:p-10 rounded-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <legend className="w-full px-2 text-left font-medium text-xl md:text-3xl leading-5 text-[#008080]">
          Edit Inventory
        </legend>
        <div className="flex flex-col justify-between w-full border-2 border-[#008080] rounded p-4">
          <div className="w-full flex flex-col justify-evenly text-[#5E5873] gap-3 border-b-2 border-[#008080] pb-3">
            <div className="flex w-full justify-center  relative items-center">
              <p className="text-[#5E5873] font-semibold text-2xl flex justify-start w-full">
                {editElement.inventoryName}
              </p>
            </div>
            <div className="w-full flex justify-between items-center">
              <p className="font-medium text-xl leading-4">
                Available Quantity
              </p>
              <p className="text-[#008080] font-medium text-xl">
                {editElement.quantity}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 my-4 text-white">
            <div className="flex flex-col md:flex-row w-full justify-stretch gap-1 md:gap-0">
              <button
                className="w-full border flex justify-center items-center p-2 h-10 bg-slate-300 rounded disabled:bg-[#EA5455] transistion-all duration-150 ease-in-out"
                disabled={!add}
                onClick={() => setAdd(!add)}
              >
                Use Inventory
              </button>
              <button
                className="w-full border flex justify-center items-center p-2 h-10 bg-slate-300 rounded disabled:bg-button transistion-all duration-150 ease-in-out"
                disabled={add}
                onClick={() => setAdd(!add)}
              >
                Add Inventory
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <input
                className="w-full border rounded h-12 p-4 invalid:border-red-500 text-black"
                type="number"
                placeholder="Quantity"
                {...register('quantity', {
                  required: 'Quantity is required',
                  min: {
                    value: 0,
                    message: 'Value cannot be less than 0',
                  },
                  ...(add
                    ? {
                        max: {
                          value: 100,
                          message: 'You cannot add more than 100 units at once',
                        },
                      }
                    : {
                        max: {
                          value: editElement.quantity,
                          message:
                            'You cannot use more inventory than avaiable',
                        },
                      }),
                })}
              />
              {errors.quantity && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.quantity.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <button
            className="w-full flex items-center justify-center h-12 p-4 rounded-lg bg-button text-white font-medium hover:bg-[#008080] transition duration-150 hover:shadow-md"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : (
              <p>Save Changes</p>
            )}
          </button>
          <button
            className="w-full flex items-center justify-center h-12 p-4 bg-gray-500 text-white rounded-lg disabled:bg-slate-300"
            disabled={loading}
            onClick={(e) => handleClose(e)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInventory;
