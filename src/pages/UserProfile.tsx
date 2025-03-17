import { UserProfileEdit } from '../models/datamodels';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { nepalJson } from '../data/nepal';
import {
  getDistrictsByProvinceName,
  getMunicipalitiesByDistrictName,
} from '../data/province';
import { useEditUserMutation, useReadRequestQuery } from '../api/apiHandler';
import { RxCross1 } from 'react-icons/rx';
import logo from '../assets/logo.png';
import { useSelector } from 'react-redux';
import { InitialState, BloodGroup } from '../models/datamodels';
import { MdCancel } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
const UserProfile = () => {
  const userId = useSelector((state: InitialState) => state.auth.userId);
  const { data: userProfile } = useReadRequestQuery(`users/${userId}`);
  const { data: bloodGroups } = useReadRequestQuery('bloodgroups');

  const form = useForm<UserProfileEdit>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  function resetPassword(userId: string) {
    navigate(`/reset-password/${userId}`);
  }
  const [editUser] = useEditUserMutation();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (editData: UserProfileEdit) => {
    console.log(editData);
    setLoading(true);
    editData.donorId = userProfile.donor.donorId;
    editData.userId = userProfile.userId;
    editData.hospitalId = userProfile.hospital.hospitalId;
    try {
      await editUser(editData).unwrap();
      toast.success('Successfully Edited User');
      navigate('/');
    } catch (error) {
      toast.error('Failed to Edit Donor');
    } finally {
      setLoading(false);
    }
  };

  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');

  useEffect(() => {
    if (userProfile) {
      setValue('donorName', userProfile?.donor.donorName);
      setValue('fatherName', userProfile?.donor.fatherName);
      setValue('emergencyContact', userProfile?.donor.emergencyContact);
      setValue('phoneNumber', userProfile?.donor.phoneNumber);
      setValue('email', userProfile?.email);
      setProvince(userProfile?.donor.province);
      setDistrict(userProfile?.donor.district);
      setMunicipality(userProfile?.donor.municipality);
      setValue('district', userProfile?.donor.district);
      setValue('municipality', userProfile?.donor.municipality);
      setValue('province', userProfile?.donor.province);
      setValue('wardNo', userProfile?.donor.wardNo);
      setValue('bloodGroupId', userProfile?.donor?.bloodGroup.bloodGroupId);
    }
  }, [userProfile]);

  const checkLastDonation = (lastDonated: Date) => {
    if (lastDonated == null) {
      return true;
    }
    const currentDate = new Date();
    const lastDonatedDate = new Date(lastDonated);
    const daysDifference =
      (currentDate.getTime() - lastDonatedDate.getTime()) /
      (1000 * 60 * 60 * 24);
    return daysDifference >= 90;
  };

  const donationEligibility = checkLastDonation(userProfile?.donor.lastDonated);

  const lastDonated = userProfile?.donor.lastDonated
    ? moment(userProfile?.donor.lastDonated).format('DD/MM/YYYY')
    : 'Not Donated';

  return (
    <div
      className="flex flex-col md:flex-row justify-around items-start bg-fixed font-[Poppins] w-full h-full py-4 gap-2"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      <div className="w-full md:w-[30%] flex flex-col gap-4 justify-start items-start bg-white rounded-lg py-8 px-2 shadow-md">
        <div className="w-full flex justify-center items-center relative">
          <div className="w-[90%] border border-black absolute"></div>
          <div className="w-20 h-20 rounded-full border border-black shadow-lg flex justify-center items-center object-cover z-10">
            <img
              src={logo}
              alt="logo"
              className="w-full h-full rounded-full "
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full border-b border-[#66b2b2] p-2">
            <p className="font-medium text-lg text-center">
              {userProfile?.donor.donorName}
            </p>
            <p className="font-medium text-lg text-center">
              {userProfile?.email}
            </p>
          </div>
          <div className="flex flex-col w-full justify-between items-start gap-3  p-2">
            <div className="w-full flex flex-col justify-start items-start gap-2 border-b border-[#66b2b2] pb-2">
              <span className="font-medium text-lg leading-6 border-b px-2">
                Donor information
              </span>
              <div className="w-full pl-4">
                <p>
                  Blood Group: {userProfile?.donor.bloodGroup.bloodGroupName}
                </p>
                <p>Father's Name: {userProfile?.donor.fatherName}</p>
                <p>Emegerency Contact: {userProfile?.donor.emergencyContact}</p>
                <p>Last Donated: {lastDonated}</p>
                <div className="flex text-lg gap-1 items-center align-middle">
                  {donationEligibility ? (
                    <div className="flex gap-1 text-green-700 text-lg items-center align-middle">
                      <TiTick className="text-2xl text-green-800" />
                      Eligible to Donate
                    </div>
                  ) : (
                    <div className="flex gap-2 text-red-600 items-center align-middle">
                      <MdCancel className=" text-xl text-red-700" />
                      Not Eligible to Donate
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-2 border-b border-[#66b2b2] pb-2">
              <span className="font-medium text-lg leading-6 border-b px-2">
                Address
              </span>
              <div className="w-full pl-4">
                <p>{userProfile?.donor.province}</p>
                <p>{userProfile?.donor.district}</p>
                <p>
                  {userProfile?.donor.municipality}-{userProfile?.donor.wardNo}
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-2 border-b border-[#66b2b2] pb-2">
              <span className="font-medium text-lg leading-6 border-b px-2">
                Affiliated Hospital
              </span>
              <div className="w-full pl-4">
                <p>{userProfile?.hospital.hospitalName}</p>
                <p>{userProfile?.hospital.hospitalAddress}</p>
              </div>
            </div>
            <p className="font-semibold text-buttons text-lg">
              Access Level:{' '}
              {useSelector(
                (state: InitialState) => state.auth.userType.userTypeName
              )}
            </p>
            <div
              onClick={() => resetPassword(userProfile.userId)}
              className="w-full"
            >
              <p className="cursor-pointer font-medium hover:underline hover:text-[#008080]">
                Change Password
              </p>
            </div>
          </div>
        </div>
      </div>
      <form
        className="w-full md:w-3/5 bg-transparent flex flex-col justify-start rounded-md gap-5 z-50 overflow-y-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-center items-center w-full pb-2 px-2 border-b-2 border-[#008080] text-[#008080]">
          <p className="w-full text-xl font-semibold leading-6 tracking-wide">
            {' '}
            Edit Admin Profile
          </p>
          <RxCross1
            className="text-2xl font-semibold text-[#008080] cursor-pointer"
            onClick={() => window.history.back()}
          />
        </div>
        <div className=" w-full flex flex-col items-center gap-5">
          <div className="w-full flex flex-col gap-2">
            <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
              Full Name
            </label>
            <input
              className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
              type="text"
              defaultValue={userProfile?.donor.donorName}
              {...register('donorName', {
                required: 'Name is required',
              })}
            />
            {errors.donorName && (
              <p
                className=" m-0 w-full items-start text-sm text-red-600"
                role="alert"
              >
                *{errors.donorName.message?.toString()}
              </p>
            )}
          </div>
          <div className="w-full flex flex-col md:flex-row gap-2">
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Father's Name
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                type="text"
                defaultValue={userProfile?.donor.fatherName}
                {...register('fatherName', {
                  required: 'Father name is required',
                  maxLength: {
                    value: 20,
                    message: 'cannot be longet than 20 characters',
                  },
                })}
              />
              {errors.fatherName && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.fatherName.message}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Emergency Contact
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                type="number"
                defaultValue={userProfile?.donor.emergencyContact}
                {...register('emergencyContact', {
                  required: 'Contact is required',
                  maxLength: {
                    value: 55,
                    message: 'Address cannot be longer than 55 characters',
                  },
                })}
              />
              {errors.emergencyContact && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.emergencyContact.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-2">
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Phone Number
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                type="number"
                defaultValue={userProfile?.donor.phoneNumber}
                {...register('phoneNumber', {
                  required: 'Contact is required',
                  maxLength: {
                    value: 55,
                    message: 'Address cannot be longer than 55 characters',
                  },
                })}
              />
              {errors.phoneNumber && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="font-medium text-lg leading-5 text-[#008080]">
                Email Address
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                defaultValue={userProfile?.email}
                {...register('email', {
                  required: 'Email is Required',
                })}
              />
              {errors.email && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col md-flex-row gap-2">
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Province
              </label>
              <select
                className="w-full h-12 p-2 border border-gray-400 rounded transition duration-200 ease-in-out focus:border-slate-100 mb-2"
                {...register('province')}
                onChange={(e) => {
                  setProvince(e.target.value);
                }}
              >
                <option value="">Select a Province</option>
                {nepalJson.provinceList.map((oneProvince) => (
                  <option key={oneProvince.id}>{oneProvince.name}</option>
                ))}
              </select>
              {errors.province && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.province.message}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                District
              </label>
              <select
                className={`w-full h-12 p-2 border border-gray-400 ${
                  errors.district ? 'border-red-500' : 'border-slate-800'
                } rounded transition duration-200 ease-in-out focus:border-slate-100 mb-2`}
                {...register('district')}
                onChange={(e) => {
                  setDistrict(e.target.value);
                }}
              >
                <option value="">Select a district</option>
                {getDistrictsByProvinceName(province).map((oneDistrict) => (
                  <option
                    key={oneDistrict.id}
                    selected={oneDistrict.name === district}
                  >
                    {oneDistrict.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.district.message}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Municipality
              </label>
              <select
                className={`w-full h-12 p-2 border border-gray-400 ${
                  errors.municipality ? 'border-red-500' : 'border-slate-800'
                } rounded transition duration-200 ease-in-out focus:border-slate-100 mb-2`}
                {...register('municipality')}
                onChange={(e) => setMunicipality(e.target.value)}
              >
                <option value="">Select a district</option>
                {getMunicipalitiesByDistrictName(district).map(
                  (oneMunicipality) => (
                    <option
                      key={oneMunicipality.id}
                      selected={oneMunicipality.name === municipality}
                    >
                      {oneMunicipality.name}
                    </option>
                  )
                )}
              </select>
              {errors.municipality && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.municipality.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-2">
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Ward No
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                type="number"
                min="1"
                max="32"
                defaultValue={userProfile?.donor.wardNo}
                {...register('wardNo', {
                  required: 'Ward no is required',
                  min: {
                    value: 1,
                    message: 'Ward no cannot be less than 1',
                  },
                  max: {
                    value: 32,
                    message: 'Ward No cannot be grearter than 32',
                  },
                })}
              />
              {errors.wardNo && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.wardNo.message}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2 ">
              <label className=" w-full text-[#008080]  text-base  font-semibold px-2">
                Bloodgroup
              </label>
              <select
                placeholder="Select your blood group"
                className=" w-full border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                {...register('bloodGroupId')}
                defaultValue={userProfile?.donor?.bloodGroup.bloodGroupId}
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
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full justify-center md:justify-start">
          <button
            className="flex items-center justify-center w-2/3 md:w-2/5 h-12 p-4 bg-[#008080] text-white rounded disabled:bg-slate-300"
            type="submit"
          >
            {loading ? <p>Loading...</p> : <p>Save Changes</p>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
