import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useEditAdminMutation,
  useReadRequestQuery,
} from "../../api/apiHandler";
import {
  EditAdminDataModel,
  EditAdminProps,
  Hospital,
  UserTypes,
} from "../../models/datamodels";
import ResetPasswordAlert from "../Alert/ResetPasswordAlert";
import { useNavigate } from "react-router";

const EditAdmin: React.FC<EditAdminProps> = ({
  editElement,
  handleCloseEdit,
}) => {
  console.log(editElement);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const handleClose = () => {
    handleCloseEdit();
  };
  const form = useForm<EditAdminDataModel>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { data: hospitals } = useReadRequestQuery("hospitals");
  const { data: userTypes } = useReadRequestQuery("userTypes");
  const [openResetDialog, setOpenResetDialog] = useState<boolean>(false);
  const [resetUser, setResetUser] = useState<string>("");
  const [editAdmin] = useEditAdminMutation();

  const onSubmit = async (editData: EditAdminDataModel) => {
    setLoading(true);
    editData.userId = editElement.userId;
    try {
      await editAdmin(editData);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    handleClose();
  };

  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
  };

  const handleReset = (id: string) => {
    setResetUser(id);
    setOpenResetDialog(true);
  };
  return (
    <div className="fixed top-0 left-0 w-screen  h-screen flex items-center justify-center bg-[#0000007A] z-50 font-[Poppins]">
      <form
        className="w-full md:w-2/5 bg-white flex flex-col justify-start items-end p-10 rounded-md gap-5 z-50 overflow-y-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full pb-2 border-b-2 border-[#008080] text-[#008080] flex flex-col md:flex-row items-start md:items-center justify-between">
          <p className="w-1/2 text-xl font-semibold leading-6 tracking-wide ">
            {" "}
            Edit Admin
          </p>
          <p
            className="text-sm text-[#008080] hover:underline cursor-pointer"
            onClick={() => handleReset(editElement.userId)}
          >
            Reset Password?
          </p>
        </div>
        <div className=" w-full flex flex-col items-center gap-5">
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-lg leading-5 text-[#008080]">
              Admin Email<span style={{ color: "#EA5455" }}>*</span>
            </label>
            <input
              className="w-full h-12 rounded-md p-2 border border-slate-800"
              defaultValue={editElement.email}
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                  message:
                    "Email should contain be in item@gmail.com, item@hotmail.com format",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-lg leading-5 text-[#008080]">
              Hospital Name<span style={{ color: "#EA5455" }}>*</span>
            </label>
            <select
              className="w-full h-12 rounded-md p-2 border border-slate-800"
              {...register("hospitalId", {
                required: "Hospital Name is required",
              })}
            >
              {hospitals?.map((oneGroup: Hospital) => (
                <option
                  key={oneGroup.hospitalId}
                  label={oneGroup.hospitalName}
                  defaultValue={editElement.hospitalId}
                  selected={
                    oneGroup.hospitalName === editElement.hospital.hospitalName
                  }
                >
                  {oneGroup.hospitalId}
                </option>
              ))}
            </select>
            {errors.hospitalId && (
              <p className=" m-0 w-full items-start text-sm text-red-600">
                *{errors.hospitalId.message}
              </p>
            )}
          </div>

          <div className=" w-full flex flex-col gap-2">
            <label className="font-medium text-lg leading-5 text-[#008080]">
              User Type<span style={{ color: "#EA5455" }}>*</span>
            </label>
            <select
              className="w-full h-12 rounded-md p-2 border border-slate-800"
              {...register("userTypeId", {
                required: "UserType Name is required",
              })}
            >
              {userTypes?.map((oneGroup: UserTypes) => (
                <option
                  key={oneGroup.userTypeId}
                  label={oneGroup.userTypeName}
                  defaultValue={editElement.userType.userTypeId}
                  selected={
                    oneGroup.userTypeName === editElement.userType.userTypeName
                  }
                >
                  {oneGroup.userTypeId}
                </option>
              ))}
            </select>
            {errors.userTypeId && (
              <p className=" m-0 w-full items-start text-sm text-red-600">
                *{errors.userTypeId.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex justify-start items-center px-2">
          <div
            className="font-medium leading-5 hover:underline text-[#008080] cursor-pointer"
            onClick={() => navigate(`edit/${editElement.userId}`)}
          >
            Edit More Details
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button
            className="flex items-center justify-center w-1/2 h-12 p-4 bg-[#008080] text-white rounded disabled:bg-slate-300"
            type="submit"
            disabled={loading}
          >
            {loading ? <p>Loading...</p> : <p>Save Changes</p>}
          </button>
          <button
            className="flex items-center justify-center w-1/2 h-12 p-4 bg-gray-500 text-white rounded disabled:bg-slate-300"
            disabled={loading}
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </form>
      <ResetPasswordAlert
        open={openResetDialog}
        onClose={handleCloseResetDialog}
        slug="users"
        id={resetUser}
      />
    </div>
  );
};

export default EditAdmin;
