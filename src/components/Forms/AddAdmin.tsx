import { useForm, SubmitHandler } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import {
  AdminData,
  BloodGroup,
  UserTypes,
  Hospital,
} from "../../models/datamodels";
import { useAddAdminMutation, useReadRequestQuery } from "../../api/apiHandler";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import RequiredField from "../Alert/RequiredField";
import { nepalJson } from "../../data/nepal";
import {
  getDistrictsByProvinceName,
  getMunicipalitiesByDistrictName,
} from "../../data/province";

export default function CreateAdmin() {
  const form = useForm<AdminData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;
  const [district, setDistrict] = useState("Rukum West");
  const [municipality, setMunicipality] = useState("Chaujhari");
  const [province, setProvince] = useState("KARNALI PROVINCE");
  const { data: bloodGroups } = useReadRequestQuery("bloodgroups");
  const { data: hospitals } = useReadRequestQuery("hospitals");
  const { data: userTypes } = useReadRequestQuery("userTypes");
  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();
  const [addAdmin] = useAddAdminMutation();
  const onSubmit: SubmitHandler<AdminData> = async (data) => {
    setDisableButton(true);
    data.isVerified = "0";
    data.fatherName = "Bhupendra Jogi";
    try {
      await addAdmin(data).unwrap();
      toast.success("Sucessfully Added Admin");
      reset();
      navigate("/admin");
    } catch (error: any) {
      {
        error.data
          ? toast.error(error.data)
          : toast.error("Could not create new admin");
      }
    } finally {
      setDisableButton(false);
    }
  };
  const registerConditions = {
    donorName: {
      required: "Name is required",
      maxLength: {
        value: 32,
        message: "Max Length is 32",
      },
      minLength: {
        value: 2,
        message: "Min length is 2",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value:
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        message: "Invalid email address",
      },
    },
    password: {
      required: "Password is required",
      maxLength: {
        value: 32,
        message: "Max Length is 32",
      },
      minLength: {
        value: 2,
        message: "Min length is 2",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
        message:
          "Invalid password, please have a uppercase, lowercase and a special character",
      },
    },
    address: {
      required: "Address is required",
    },
    generic: {
      required: "This field is required",
    },
    province: {
      required: "This field is required",
    },
    hospital: {
      required: "Select a hospital",
    },
    phoneNumber: {
      required: "Phone number is required",
      maxLength: {
        value: 10,
        message: "Max Length is 10",
      },
      minLength: {
        value: 10,
        message: "Minimum length is 10",
      },
    },
    emergencyContact: {
      required: "Phone number is required",
      maxLength: {
        value: 10,
        message: "Max Length is 10",
      },
      minLength: {
        value: 8,
        message: "Minimum length is 8",
      },
    },
    bloodGroupId: {
      required: "Blood Group is a required ",
    },
  };

  return (
    <>
      <div className="flex items-center justify-center h-full">
        <main
          className="flex flex-col justify-center items-center bg-fixed font-[Poppins] w-full h-full"
          style={{ backgroundImage: 'url("/designRectangle.png")' }}
        >
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className="flex justify-between w-full text-xl md:text-3xl font-semibold leading-6 tracking-wide border-b-2 border-[#008080] text-[#008080] px-2 pb-1">
              <p>Add an Admin</p>
              <RxCross1
                className="text-xl md:text-2xl font-semibold text-[#008080] cursor-pointer"
                onClick={() => navigate("/admin")}
              />
            </div>

            <div className="flex items-center w-full justify-center">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-1 w-full justify-center"
              >
                <div className="w-full">
                  <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                    Name<span style={{ color: "#EA5455" }}>*</span>
                  </label>
                  <input
                    className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    {...register("donorName", registerConditions.donorName)}
                  />
                  {errors.donorName && (
                    <RequiredField message={errors.donorName.message} />
                  )}
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2">
                  <div className="w-full">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Email<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <input
                      className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register("email", registerConditions.generic)}
                    />
                    {errors.email && (
                      <RequiredField message={errors.email.message} />
                    )}
                  </div>
                  <div className="w-full">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Password<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <input
                      className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      type="password"
                      {...register("password", registerConditions.generic)}
                    />
                    {errors.password && (
                      <RequiredField message={errors.password.message} />
                    )}
                  </div>
                </div>
                <div className=" flex flex-col md:flex-row gap-2 w-full">
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Father's Name
                      <span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className=" px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register("fatherName", registerConditions.generic)}
                    />
                    {errors.fatherName && (
                      <RequiredField message={errors.fatherName.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Address<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register("address", registerConditions.generic)}
                    />
                    {errors.address && (
                      <RequiredField message={errors.address.message} />
                    )}
                  </div>
                </div>
                <div className=" flex align-middle justify-center items-center flex-col md:flex-row gap-2 w-full">
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Phone Number<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register(
                        "phoneNumber",
                        registerConditions.phoneNumber
                      )}
                    />
                    {errors.emergencyContact && (
                      <RequiredField message={errors.phoneNumber?.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Emergency Number<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register(
                        "emergencyContact",
                        registerConditions.phoneNumber
                      )}
                    />
                    {errors.emergencyContact && (
                      <RequiredField message={errors.phoneNumber?.message} />
                    )}
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2">
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Province<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register("province", registerConditions.province)}
                      defaultValue={"KARNALI PROVINCE"}
                      onChange={(e) => {
                        setProvince(e.target.value);
                      }}
                    >
                      <option label="Select a province" />
                      {nepalJson.provinceList.map((province) => (
                        <option key={province.id} value={province.name}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <RequiredField message={errors.province.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                      District<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register("district", registerConditions.generic)}
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                      }}
                    >
                      <option value="">Select a district</option>
                      {getDistrictsByProvinceName(province).map(
                        (oneDistrict) => (
                          <option key={oneDistrict.id} value={oneDistrict.name}>
                            {oneDistrict.name}
                          </option>
                        )
                      )}
                    </select>
                    {errors.district && (
                      <RequiredField message={errors.district.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Municipality<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register("municipality", registerConditions.generic)}
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                    >
                      <option value="">Select a municipality</option>
                      {getMunicipalitiesByDistrictName(district).map(
                        (oneMunicipality) => (
                          <option
                            key={oneMunicipality.id}
                            value={oneMunicipality.name}
                          >
                            {oneMunicipality.name}
                          </option>
                        )
                      )}
                    </select>
                    {errors.municipality && (
                      <RequiredField message={errors.municipality.message} />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Ward<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register("wardNo", registerConditions.generic)}
                    />
                    {errors.wardNo && (
                      <RequiredField message={errors.wardNo.message} />
                    )}
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2 my-3">
                  <div className="w-full flex justify-center items-center align-middle flex-col gap-2 ">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Bloodgroup<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <select
                      placeholder="Select your blood group"
                      className=" w-full border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register(
                        "bloodGroupId",
                        registerConditions.bloodGroupId
                      )}
                    >
                      <option label="Select a Blood Group"></option>
                      {bloodGroups?.map((oneGroup: BloodGroup) => (
                        <option
                          key={oneGroup.bloodGroupId}
                          value={oneGroup.bloodGroupId}
                        >
                          {oneGroup.bloodGroupName}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroupId && (
                      <RequiredField message={errors.bloodGroupId.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Last Donated
                    </label>
                    <input
                      className="border w-full h-12 rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      type="date"
                      {...register("lastDonated")}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Date Of Birth<span style={{ color: "#EA5455" }}>*</span>
                      <input
                        type="date"
                        className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                        {...register("dateOfBirth", registerConditions.generic)}
                      />
                    </label>
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2 my-3">
                  <div className="w-full flex flex-col gap-2 ">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      User Type<span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <select
                      placeholder="Select your blood group"
                      className=" w-full border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register("userTypeId", registerConditions.generic)}
                    >
                      <option label="Select a usertype"></option>
                      {userTypes?.map((oneGroup: UserTypes) => (
                        <option label={oneGroup.userTypeName}>
                          {oneGroup.userTypeId}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroupId && (
                      <RequiredField message={errors.bloodGroupId.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Hospital Affailiated
                      <span style={{ color: "#EA5455" }}>*</span>
                    </label>
                    <select
                      placeholder="Select your blood group"
                      className=" w-full border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register("hospitalId", registerConditions.generic)}
                    >
                      <option label="Select Hospital"></option>
                      {hospitals?.map((oneGroup: Hospital) => (
                        <option label={oneGroup.hospitalName}>
                          {oneGroup.hospitalId}
                        </option>
                      ))}
                    </select>
                    {errors.hospitalId && (
                      <RequiredField message={errors.hospitalId?.message} />
                    )}
                  </div>
                </div>
                <div className="w-full flex items-center  justify-center md:justify-start">
                  <button
                    disabled={disableButton}
                    type="submit"
                    className="flex justify-center items-center w-2/3 md:w-1/3 h-12 p-4 bg-[#008080] text-white rounded disabled:bg-slate-300"
                  >
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
