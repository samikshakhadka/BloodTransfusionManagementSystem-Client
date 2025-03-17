import { useForm, SubmitHandler } from 'react-hook-form';
import { RxCross1 } from 'react-icons/rx';
import {
  AdminData,
  BloodGroup,
  UserTypes,
  Hospital,
  EditAdminData,
} from '../../models/datamodels';
import {
  useEditAdminFullMutation,
  useReadRequestQuery,
} from '../../api/apiHandler';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import RequiredField from '../Alert/RequiredField';
import { nepalJson } from '../../data/nepal';
import {
  getDistrictsByProvinceName,
  getMunicipalitiesByDistrictName,
} from '../../data/province';

export default function EditAdmin() {
  const { userId } = useParams();
  const form = useForm<AdminData>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = form;
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [province, setProvince] = useState('');
  const { data: bloodGroups } = useReadRequestQuery('bloodgroups');
  const { data: hospitals } = useReadRequestQuery('hospitals');
  const { data: userTypes } = useReadRequestQuery('userTypes');
  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();
  const [editUser] = useEditAdminFullMutation();
  const onSubmit: SubmitHandler<EditAdminData> = async (data) => {
    setDisableButton(true);
    data.userId = userData.userId;
    data.donorId = userData.donorId;
    try {
      await editUser(data).unwrap();
      toast.success('Sucessfully Editied Admin Details');
      reset();
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to edit Admin');
    } finally {
      setDisableButton(false);
    }
  };
  const registerConditions = {
    donorName: {
      required: 'Name is required',
      maxLength: {
        value: 32,
        message: 'Max Length is 32',
      },
      minLength: {
        value: 2,
        message: 'Min length is 2',
      },
    },
    fatherName: {
      required: "Father's Name is required",
      maxLength: {
        value: 32,
        message: 'Max Length is 32',
      },
      minLength: {
        value: 2,
        message: 'Min Length is 2',
      },
    },
    email: {
      required: 'Email is required',
      pattern: {
        value:
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        message: 'Invalid email address',
      },
    },
    password: {
      required: 'Password is required',
      maxLength: {
        value: 32,
        message: 'Max Length is 32',
      },
      minLength: {
        value: 2,
        message: 'Min length is 2',
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
        message:
          'Invalid password, please have a uppercase, lowercase and a special character',
      },
    },
    address: {
      required: 'Address is required',
    },
    generic: {
      required: 'This field is required',
    },
    province: {
      required: 'This field is required',
    },
    hospital: {
      required: 'Select a hospital',
    },
    phoneNumber: {
      required: 'Phone number is required',
      maxLength: {
        value: 10,
        message: 'Max Length is 10',
      },
      minLength: {
        value: 10,
        message: 'Minimum length is 10',
      },
    },
    emergencyContact: {
      required: 'Phone number is required',
      maxLength: {
        value: 10,
        message: 'Max Length is 10',
      },
      minLength: {
        value: 8,
        message: 'Minimum length is 8',
      },
    },
    bloodGroupId: {
      required: 'Blood Group is a required ',
    },
  };

  const { data: userData } = useReadRequestQuery(`users/${userId}`);

  useEffect(() => {
    if (userData) {
      setValue('donorName', userData?.donor.donorName);
      setValue('email', userData?.email);
      setValue('phoneNumber', userData?.donor.phoneNumber);
      setValue('fatherName', userData?.donor.fatherName);
      setValue('emergencyContact', userData?.donor.emergencyContact);
      setValue('bloodGroupId', userData?.donor?.bloodGroup.bloodGroupId);
      setValue('province', userData?.donor.province);
      setValue('district', userData?.donor.district);
      setValue('municipality', userData?.donor.municipality);
      setProvince(userData?.donor.province);
      setDistrict(userData?.donor.district);
      setMunicipality(userData?.donor.municipality);
      setValue('wardNo', userData?.donor.wardNo);
      setValue('hospitalId', userData?.donor?.hospital?.hospitalId);
      setValue('userTypeId', userData?.userType.userTypeId);
      setValue('lastDonated', userData?.donor?.lastDonated?.split('T')[0]);
      setValue('dateOfBirth', userData?.donor?.dateOfBirth?.split('T')[0]);
    }
  }, [userData]);

  return (
    <>
      <div className="flex items-center justify-center h-full">
        <main
          className="flex flex-col justify-center items-center bg-fixed font-[Poppins] w-full h-full"
          style={{ backgroundImage: 'url("/designRectangle.png")' }}
        >
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className="flex justify-between w-full text-xl md:text-3xl font-semibold leading-6 tracking-wide border-b-2 border-[#008080] text-[#008080] px-2 pb-1">
              <p>Edit Admin Information</p>
              <RxCross1
                className="text-xl md:text-2xl font-semibold text-[#008080] cursor-pointer"
                onClick={() => navigate('/admin')}
              />
            </div>

            <div className="flex items-center w-full justify-center">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-1 w-full justify-center"
              >
                <div className="w-full">
                  <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                    Name<span style={{ color: '#EA5455' }}>*</span>
                  </label>
                  <input
                    className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    {...register('donorName', registerConditions.donorName)}
                  />
                  {errors.donorName && (
                    <RequiredField message={errors.donorName.message} />
                  )}
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2">
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Email<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <input
                      className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('email', registerConditions.generic)}
                    />
                    {errors.email && (
                      <RequiredField message={errors.email.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Father's Name<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <input
                      className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('fatherName', registerConditions.fatherName)}
                    />
                    {errors.donorName && (
                      <RequiredField message={errors.fatherName?.message} />
                    )}
                  </div>
                </div>
                <div className=" flex flex-col md:flex-row gap-2 w-full">
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Phone Number<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register(
                        'phoneNumber',
                        registerConditions.phoneNumber
                      )}
                    />
                    {errors.emergencyContact && (
                      <RequiredField message={errors.phoneNumber?.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Landline number
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register(
                        'emergencyContact',
                        registerConditions.phoneNumber
                      )}
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2">
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Province<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      defaultValue={userData?.donor.province}
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('province', registerConditions.province)}
                      onChange={(e) => {
                        setProvince(e.target.value);
                      }}
                    >
                      <option label="Select a province" />
                      {nepalJson.provinceList.map((province) => (
                        <option
                          key={province.id}
                          selected={userData?.donor.province === province.name}
                        >
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
                      District<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('district', registerConditions.generic)}
                      value={district}
                      defaultValue={userData?.donor.district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                      }}
                    >
                      <option value="">Select a district</option>
                      {getDistrictsByProvinceName(province).map(
                        (oneDistrict) => (
                          <option
                            key={oneDistrict.id}
                            selected={
                              userData?.donor.district === oneDistrict.name
                            }
                          >
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
                      Municipality<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('municipality', registerConditions.generic)}
                      defaultValue={userData?.donor.municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                    >
                      <option value="">Select a municipality</option>
                      {getMunicipalitiesByDistrictName(district).map(
                        (oneMunicipality) => (
                          <option
                            key={oneMunicipality.id}
                            selected={municipality === oneMunicipality.name}
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
                      Ward<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('wardNo', registerConditions.generic)}
                    />
                    {errors.wardNo && (
                      <RequiredField message={errors.wardNo.message} />
                    )}
                  </div>
                </div>
                <div className="w-full justify-between align-middle items-center flex flex-col md:flex-row gap-2 my-3">
                  <div className="w-1/2 flex flex-col gap-2 ">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Bloodgroup<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      placeholder="Select your blood group"
                      className=" w-full border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register(
                        'bloodGroupId',
                        registerConditions.bloodGroupId
                      )}
                    >
                      <option label="Select a Blood Group"></option>
                      {bloodGroups?.map((oneGroup: BloodGroup) => (
                        <option
                          key={oneGroup.bloodGroupId}
                          value={oneGroup.bloodGroupId}
                          selected={
                            oneGroup.bloodGroupName ===
                            userData?.donor?.bloodGroup.bloodGroupName
                          }
                        >
                          {oneGroup.bloodGroupName}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroupId && (
                      <RequiredField message={errors.bloodGroupId.message} />
                    )}
                  </div>
                  <div className="w-1/2 flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Last Donated
                    </label>
                    <input
                      className="border w-full h-12 rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      type="date"
                      defaultValue={userData?.donor?.lastDonated?.split('T')[0]}
                      {...register('lastDonated')}
                    />
                  </div>
                  <div className="w-full">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Date Of Birth<span style={{ color: '#EA5455' }}>*</span>
                      <input
                        type="date"
                        className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                        defaultValue={
                          userData?.donor?.dateOfBirth?.split('T')[0]
                        }
                        {...register('dateOfBirth', registerConditions.generic)}
                      />
                    </label>
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2 my-3">
                  <div className="w-full flex flex-col gap-2 ">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      User Type<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      placeholder="Select your blood group"
                      className=" w-full border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('userTypeId', registerConditions.generic)}
                    >
                      <option label="Select a usertype"></option>
                      {userTypes?.map((oneGroup: UserTypes) => (
                        <option
                          label={oneGroup.userTypeName}
                          selected={
                            oneGroup.userTypeName ===
                            userData?.userType.userTypeName
                          }
                        >
                          {oneGroup.userTypeId}
                        </option>
                      ))}
                    </select>
                    {errors.userTypeId && (
                      <RequiredField message={errors.userTypeId.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Hospital Affailiated
                      <span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      placeholder="Select your blood group"
                      className=" w-full border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('hospitalId', registerConditions.generic)}
                    >
                      <option label="Select Hospital"></option>
                      {hospitals?.map((oneGroup: Hospital) => (
                        <option
                          label={oneGroup.hospitalName}
                          selected={
                            oneGroup.hospitalName ===
                            userData?.donor?.hospital?.hospitalName
                          }
                        >
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
                    Save Changes
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
