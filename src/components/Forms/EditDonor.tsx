import { useForm, SubmitHandler } from 'react-hook-form';
import { BloodGroup, EditDonors, InitialState } from '../../models/datamodels';
import {
  useReadRequestQuery,
  useEditDonorMutation,
} from '../../api/apiHandler';
import { nepalJson } from '../../data/nepal';
import {
  getDistrictsByProvinceName,
  getMunicipalitiesByDistrictName,
} from '../../data/province';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import Loading from '../Loading/Loading';
import RequiredField from '../Alert/RequiredField';
import { useSelector } from 'react-redux';
import { RxCross1 } from 'react-icons/rx';

export default function EditDonor() {
  const form = useForm<EditDonors>();
  const { donorId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;

  const { data: bloodGroups } = useReadRequestQuery('bloodgroups');
  const {
    data: donorData,
    isLoading,
    error,
  } = useReadRequestQuery(`donors/${donorId}`);

  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();
  const [editDonor] = useEditDonorMutation();
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const hospitalId = useSelector(
    (state: InitialState) => state.auth.hospitalId
  );

  useEffect(() => {
    if (donorData) {
      setProvince(donorData.province);
      setDistrict(donorData.district);
      setMunicipality(donorData.municipality);
      setValue('district', donorData.district);
      setValue('municipality', donorData.municipality);
      console.log(donorData.lastDonated);
      if (donorData.lastDonated) {
        setValue('lastDonated', donorData.lastDonated.split('T')[0]);
      }
    }
  }, [donorData]);

  const onSubmit: SubmitHandler<EditDonors> = async (data) => {
    data.donorId = donorData.donorId;
    data.hospitalId = hospitalId;
    if (!data.lastDonated) {
      data.lastDonated = null;
    }
    setDisableButton(true);
    try {
      await editDonor(data).unwrap();
      toast.success('Successfully Edited Donor');
      navigate('/donor');
    } catch (error) {
      toast.error('Failed to Edit Donor');
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
    generic: {
      required: 'This field is required',
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
      maxLength: {
        value: 10,
        message: 'Max Length is 10',
      },
      minLength: {
        value: 8,
        message: 'Minimum length is 8',
      },
    },
  };

  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <p>Unable to fetch data of this particular donor</p>;
  } else {
    return (
      <div className="flex items-center justify-center h-full">
        <main
          className="flex flex-col justify-center items-center bg-fixed font-[Poppins] w-full h-full"
          style={{ backgroundImage: 'url("/designRectangle.png")' }}
        >
          <div className="w-full md:w-2/3 mb-5 pb-2 flex flex-col gap-4">
            <div className=" flex justify-between w-full text-xl md:text-3xl font-semibold leading-6 tracking-wide border-b-2 border-[#008080] text-[#008080] px-2 pb-1">
              <p>Edit a Donor</p>
              <RxCross1
                className="text-xl md:text-2xl font-semibold text-[#008080] cursor-pointer"
                onClick={() => navigate('/donor')}
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
                    defaultValue={donorData?.donorName}
                  />
                  {errors.donorName && (
                    <RequiredField message={errors.donorName.message} />
                  )}
                </div>
                <div className=" flex flex-col md:flex-row gap-2 w-full">
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Contact Number<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register(
                        'phoneNumber',
                        registerConditions.phoneNumber
                      )}
                      defaultValue={donorData.phoneNumber}
                    />
                    {errors.phoneNumber && (
                      <RequiredField message={errors.phoneNumber.message} />
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Emergency Contact
                    </label>
                    <input
                      type="number"
                      className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register(
                        'emergencyContact',
                        registerConditions.phoneNumber
                      )}
                      defaultValue={donorData.emergencyContact}
                    />
                  </div>
                </div>
                <div className="w-full flex gap-2">
                  <div className="w-full">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Father's Name<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <input
                      className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('fatherName', registerConditions.generic)}
                      defaultValue={donorData?.fatherName}
                    />
                    {errors.donorName && (
                      <RequiredField message={errors.donorName.message} />
                    )}
                  </div>
                  <div className="w-1/4">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Date Of Birth<span style={{ color: '#EA5455' }}>*</span>
                      <input
                        type="date"
                        className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                        defaultValue={donorData.dateOfBirth?.split('T')[0]}
                        {...register('dateOfBirth', registerConditions.generic)}
                      />
                    </label>
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2">
                  <div className="w-full flex flex-col gap-2">
                    <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                      Province<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('province', registerConditions.generic)}
                      onChange={(e) => {
                        setProvince(e.target.value);
                      }}
                      defaultValue={donorData.province}
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
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      District<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('district', registerConditions.generic)}
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
                      Municipality<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('municipality', registerConditions.generic)}
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
                      Ward<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <input
                      min="1"
                      max="35"
                      type="number"
                      className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('wardNo', registerConditions.generic)}
                      defaultValue={donorData.wardNo}
                    />
                    {errors.wardNo && (
                      <RequiredField message={errors.wardNo.message} />
                    )}
                  </div>
                  {/* BloodGroup */}
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2 my-3">
                  <div className="w-full flex flex-col gap-2 ">
                    <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                      Bloodgroup<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      placeholder="Select your blood group"
                      className=" w-full border rounded-md h-12 p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('bloodGroupId', registerConditions.generic)}
                      defaultValue={donorData.bloodGroup.bloodGroupId}
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
                      defaultValue={donorData.lastDonated?.split('T')[0]}
                      {...register('lastDonated')}
                    />
                  </div>
                </div>
                <div className="flex gap-4 w-full justify-center md:justify-start">
                  <button
                    disabled={disableButton}
                    type="submit"
                    className="flex items-center justify-center w-2/3 md:w-1/3 h-12 p-4 bg-[#008080] text-white rounded disabled:bg-slate-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
