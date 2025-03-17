import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import {
  useReadRequestQuery,
  useAddPatientMutation,
} from "../../api/apiHandler";
import { PatientData } from "../../models/datamodels";
import { toast } from "react-toastify";
import RequiredField from "../Alert/RequiredField";
import { nepalJson } from "../../data/nepal";
import { RxCross1 } from "react-icons/rx";

import {
  getDistrictsByProvinceName,
  getMunicipalitiesByDistrictName,
} from "../../data/province";
import { useNavigate } from "react-router";
interface CreatePatientProps {
  handleOpenForm: () => void;
}

const AddPatient: React.FC<CreatePatientProps> = (props) => {
  const [addPatient] = useAddPatientMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PatientData>();
  const { data: bloodGroup } = useReadRequestQuery("BloodGroups");
  const { data: hospital } = useReadRequestQuery("Hospitals");
  const [district, setDistrict] = useState("Rukum West");
  const [municipality, setMunicipality] = useState("Chaujhari");
  const [province, setProvince] = useState("KARNALI PROVINCE");
  const [wardNo, setWardNo] = useState("");
  const navigate = useNavigate();

  const [loading] = useState<boolean>(false);
  const onSubmit = async (data: PatientData) => {
    try {
      await addPatient(data);
      toast.success("Successfully Added new patient");
      navigate("/patientwaitlist");
    } catch (error) {
      toast.error("Failed to Add new Patient");
    }
    props.handleOpenForm();
  };

  const handleProvinceChange = (selectedProvince: string) => {
    setProvince(selectedProvince);
    setDistrict("");
    setMunicipality("");
  };


  return (
    <div className="flex items-center justify-center h-full">
      <div
        className="flex flex-col justify-center items-center bg-fixed font-[Poppins] w-full h-full"
        style={{ backgroundImage: 'url("/designRectangle.png")' }}
      >
        <div className=" w-full md:w-2/3 flex flex-col gap-4">
          <div className="flex justify-between w-full  text-xl md:text-3xl font-semibold leading-6 tracking-wide border-b-2 border-[#008080] text-[#008080] px-2 pb-1">
            <p>Add a Patient</p>
            <RxCross1
              className="text-xl md:text-2xl font-semibold text-[#008080] cursor-pointer"
              onClick={() => navigate("/patientwaitlist")}
            />
          </div>
          <div className="flex items-center w-full justify-center">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 p-1 w-full justify-center"
            >
              <div className="w-full">
                <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                  Name<span style={{color: '#EA5455'}}>*</span>
                </label>
                <input
                  className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                  type="text"
                  {...register("patientName", {
                    required: "Full Name is required",
                    pattern: {
                      value: /[A-Za-z]{4}/,
                      message:
                        "Full Name should contain at least 4 alphabetic characters.",
                    },
                  })}
                />
                {errors.patientName && (
                  <span className="text-red-500">
                    {errors.patientName.message}
                  </span>
                )}
              </div>
              <div className=" flex flex-col md:flex-row gap-2 w-full">
                <div className="w-full flex flex-col gap-2">
                  <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                    Phone Number<span style={{color: '#EA5455'}}>*</span>
                  </label>
                  <input
                    type="tel"
                    className=" w-full px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    {...register("phoneNumber", {
                      required: "Phone Number is required",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone Number should be 10 digits.",
                      },
                    })}
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-500">
                      {errors.phoneNumber.message}
                    </span>
                  )}
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                    Blood Group<span style={{color: '#EA5455'}}>*</span>
                  </label>
                  <select
                    className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5] "
                    {...register("bloodGroupId", {
                      required: "Blood Group is required",
                    })}
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroup?.map((item: any) => (
                      <option key={item.bloodGroupId} value={item.bloodGroupId}>
                        {item.bloodGroupName}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroupId && (
                    <span className="text-red-500">
                      {errors.bloodGroupId.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col md:flex-row gap-2">
                <div className="w-full flex flex-col gap-2">
                  <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                    Hospital<span style={{color: '#EA5455'}}>*</span>
                  </label>
                  <select
                    className=" w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5] "
                    {...register("hospitalId", {
                      required: "Hospital Name is required",
                    })}
                  >
                    <option value="">Select Hospital</option>
                    {hospital?.map((item: any) => (
                      <option key={item.hospitalId} value={item.hospitalId}>
                        {item.hospitalName}
                      </option>
                    ))}
                  </select>
                  {errors.hospitalId && (
                    <span className="text-red-500">
                      {errors.hospitalId.message}
                    </span>
                  )}
                </div>

                <div className="w-full flex flex-col gap-2">
                  <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                    Province<span style={{color: '#EA5455'}}>*</span>
                  </label>
                  <select
                    className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    {...register("province")}
                    defaultValue={"KARNALI PROVINCE"}
                    value={"KARNALI PROVINCE"}
                    onChange={(e) => handleProvinceChange(e.target.value)}
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
              </div>
              <div className="w-full flex flex-col md:flex-row gap-2">
                <div className="w-full flex flex-col gap-2">
                  <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                    District<span style={{color: '#EA5455'}}>*</span>
                  </label>
                  <select
                    className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    {...register("district", {
                      required: "District Name is required",
                    })}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    <option value="">Select District</option>
                    {getDistrictsByProvinceName(province).map((oneDistrict) => (
                      <option key={oneDistrict.id} value={oneDistrict.name}>
                        {oneDistrict.name}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <RequiredField message={errors.district.message} />
                  )}
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                    Municipality<span style={{color: '#EA5455'}}>*</span>
                  </label>
                  <select
                    className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    {...register("municipality", {
                      required: "Municipality Name is required",
                    })}
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                  >
                    <option value="">Select Municipality</option>
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
                    Ward<span style={{color: '#EA5455'}}>*</span>
                  </label>
                  <input
                   min="1"
                   max="35"
                    type="number"
                    className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    {...register("wardNo", {
                      required: "Ward No. is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Ward No. should be a number.",
                      },
                    })}
                    value={wardNo}
                    onChange={(e) => setWardNo(e.target.value)}
                  />
                  {errors.wardNo && (
                    <span className="text-red-500">
                      {errors.wardNo.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full">
                <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                  Remarks
                </label>
                <textarea
                  className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                  {...register("remarks", {
                    validate: (value) => {
                      if (value.length > 255) {
                        return "Remarks should not exceed 255 characters";
                      }
                      return true;
                    },
                  })}
                ></textarea>
                {errors.remarks && (
                  <span className="text-red-500">{errors.remarks.message}</span>
                )}
              </div>

              <div className="flex gap-4 w-full justify-center md:justify-start">
                <button
                  className="flex items-center justify-center w-2/3 md:w-1/3 h-12 p-4 bg-[#008080] text-white rounded disabled:bg-slate-300"
                  type="submit"
                >
                  {loading ? <CircularProgress /> : <p>Create Record</p>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddPatient;
