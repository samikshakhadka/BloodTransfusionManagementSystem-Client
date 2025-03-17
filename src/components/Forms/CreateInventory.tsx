import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useReadRequestQuery,
  useAddInventoryMutation,
} from "../../api/apiHandler";
import { BloodGroup, InventoryData, CreateInventoryProps, Hospital } from "../../models/datamodels";
import { toast } from "react-toastify";

const CreateInventory: React.FC<CreateInventoryProps> = (props) => {
  const [addInventory] = useAddInventoryMutation();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<InventoryData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: InventoryData) => {
    setLoading(true);
    try {
      await addInventory(data);
      toast.success("Successfully Created Inventory Item");
    } catch (er) {
      toast.error("Failed to create Inventory");
    }
    props.handleOpenForm();
  };

  const handelCloseForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    props.handleOpenForm(e);
  };

  const { data: bloodGroups } = useReadRequestQuery("bloodgroups");
  const { data: hospitals } = useReadRequestQuery("hospitals");

  return (
    <div className="flex justify-end fixed top-0 left-0 w-[100vw] h-[100vh] bg-[#0000007A] z-50">
      <div className="w-2/5 h-screen bg-white flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-4/5 h-4/5 margin-auto flex flex-col justify-start items-start rounded-md p-10 gap-10"
        >
          <div className="w-full flex items-center justify-between border-b-2 border-[#008080]">
            <p className="text-xl font-semibold leading-10 tracking-wide text-[#008080]">
              Create a new Inventory Item
            </p>
            <AiOutlineCloseCircle
              className="text-[#008080] text-2xl cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handelCloseForm(e)}
            />
          </div>
          <div className=" w-full flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <label className="font-semibold leading-6 text-lg tracking-normal text-[#008080]">
                Inventory Name
              </label>
              <input
                className="w-full rounded-md h-12 p-4 border"
                type="text"
                id="inventoryName"
                {...register("inventoryName", {
                  required: "Inventory Name is required",
                })}
              />
              {errors.inventoryName && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.inventoryName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold leading-6 text-lg tracking-normal text-[#008080]">
                Blood Group
              </label>
              <select
                className="w-full rounded-md h-12 px-4 border"
                {...register("bloodGroupId", {
                  required: "BloodGroup is required",
                })}
              >
                <option label="Select a blood group"></option>
                {bloodGroups?.map((oneGroup: BloodGroup) => (
                  <option label={oneGroup.bloodGroupName}>
                    {oneGroup.bloodGroupId}
                  </option>
                ))}
              </select>
              {errors.bloodGroupId && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                >
                  *{errors.bloodGroupId.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold leading-6 text-lg tracking-normal text-[#008080]">
                Hospital
              </label>
              <select
                className="w-full rounded-md h-12 px-4 border"
                {...register("hospitalId", {
                  required: "Hospital is required",
                })}
              >
                <option label="Select a hospital"></option>
                {hospitals?.map((oneHospital: Hospital) => (
                  <option label={oneHospital.hospitalName}>
                    {oneHospital.hospitalId}
                  </option>
                ))}
              </select>
              {errors.hospitalId && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                >
                  *{errors.hospitalId.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold leading-6 text-lg tracking-normal text-[#008080]">
                Quantity
              </label>
              <input
                className="w-full rounded-md h-12 p-4 border"
                type="number"
                id="bloodGroup"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: {
                    value: 0,
                    message: "Value cannot be less than 0"
                  }
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
          <div className="w-full flex gap-4">
            <button
              className="border w-full h-10 rounded p-2 bg-[#008080] text-white font-medium disabled:bg-slate-300"
              type="submit"
              disabled={loading}
            >
              Add
            </button>
            <button
              className="border w-full h-10 rounded p-2 bg-gray-500 text-white font-medium"
              onClick={handelCloseForm}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInventory;
