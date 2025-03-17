import { Hospital } from '../../models/datamodels';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEditHospitalMutation } from '../../api/apiHandler';
import { nepalJson } from '../../data/nepal';
import {
  getDistrictsByProvinceName,
  getMunicipalitiesByDistrictName,
} from '../../data/province';
import { useParams } from 'react-router';
import { useReadRequestQuery } from '../../api/apiHandler';
import { RxCross1 } from 'react-icons/rx';

const EditHospital = () => {
  const { hospitalId } = useParams();

  const { data: hospitalProfile } = useReadRequestQuery(
    `hospitals/${hospitalId}`
  );

  useEffect(() => {
    if (hospitalProfile) {
      setProvince(hospitalProfile.province);
      setDistrict(hospitalProfile.district);
      setMunicipality(hospitalProfile.municipality);
      setValue('hospitalName', hospitalProfile.hospitalName);
      setValue('contactPerson', hospitalProfile.contactPerson);
      setValue('hospitalAddress', hospitalProfile.hospitalAddress);
      setValue('logoUrl', hospitalProfile.logoUrl);
      setValue('hospitalDescription', hospitalProfile.hospitalDescription);
      setValue('wardNo', hospitalProfile.wardNo);
      setValue('hospitalEmail', hospitalProfile.hospitalEmail);
      setValue('phoneNumber1', hospitalProfile.phoneNumber1);
      setValue('province', hospitalProfile.province);
      setValue('district', hospitalProfile.district);
      setValue('municipality', hospitalProfile.municipality);
      if (hospitalProfile.phoneNumber2) {
        setValue('phoneNumber2', hospitalProfile?.phoneNumber2);
      }
    }
  }, [hospitalProfile]);

  const form = useForm<Hospital>();

  const [editHospital] = useEditHospitalMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (editData: Hospital) => {
    setLoading(true);
    hospitalId && (editData.hospitalId = hospitalId);
    try {
      await editHospital(editData);
      toast.success('Successfully edited the hospital profile');
      window.history.back();
    } catch (er) {
      console.log(er);
    }
    setLoading(false);
  };

  const [province, setProvince] = useState<string>(hospitalProfile?.province);
  const [district, setDistrict] = useState<string>(hospitalProfile?.district);
  const [municipality, setMunicipality] = useState<string>(
    hospitalProfile?.municipality
  );

  return (
    <div
      className="flex flex-col lg:flex-row justify-around items-start bg-fixed font-[Poppins] w-full h-full py-4"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      <form
        className="w-full lg:w-3/5 bg-transparent flex flex-col justify-start rounded-md gap-5 z-50 overflow-y-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-center items-center w-full pb-2 px-2 border-b-2 border-[#008080] text-[#008080]">
          <p className="w-full text-xl md:text-3xl font-semibold leading-6 tracking-wide">
            {' '}
            Edit Hospital Profile
          </p>
          <RxCross1
            className="text-xl lg:text-2xl font-semibold text-[#008080] cursor-pointer"
            onClick={() => window.history.back()}
          />
        </div>
        <div className=" w-full flex flex-col items-center gap-5">
          <div className="w-full flex flex-col gap-2">
            <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
              Hospital Name<span style={{ color: '#EA5455' }}>*</span>
            </label>
            <input
              className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
              type="text"
              defaultValue={hospitalProfile?.hospitalName}
              {...register('hospitalName', {
                required: 'Hospital Name is required',
                maxLength: {
                  value: 55,
                  message: 'Hospital Name cannot be longer than 55 characters',
                },
              })}
            />
            {errors.hospitalName && (
              <p
                className=" m-0 w-full items-start text-sm text-red-600"
                role="alert"
              >
                *{errors.hospitalName.message}
              </p>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-lg leading-5 text-[#008080]">
              Hospital Description
            </label>
            <textarea
              className="w-full h-40 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
              defaultValue={hospitalProfile?.hospitalDescription}
              {...register('hospitalDescription', {
                minLength: {
                  value: 200,
                  message: 'Description needs to be atleast 200 characters',
                },
                maxLength: {
                  value: 1000,
                  message: 'Description cannot be longer than 1000 characters',
                },
              })}
            />
            {errors.hospitalDescription && (
              <p
                className=" m-0 w-full items-start text-sm text-red-600"
                role="alert"
              >
                *{errors.hospitalDescription.message}
              </p>
            )}
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-2">
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Province<span style={{ color: '#EA5455' }}>*</span>
              </label>
              <select
                className="w-full h-12 p-2 border border-gray-400 rounded transition duration-200 ease-in-out focus:border-slate-100 mb-2"
                {...register('province')}
                onChange={(e) => {
                  setProvince(e.target.value);
                }}
              >
                {nepalJson.provinceList.map((oneProvince) => (
                  <option
                    key={oneProvince.id}
                    defaultValue={hospitalProfile?.province}
                    selected={hospitalProfile?.province === oneProvince.name}
                  >
                    {oneProvince.name}
                  </option>
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
                District<span style={{ color: '#EA5455' }}>*</span>
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
                {getDistrictsByProvinceName(province).map((oneDistrict) => (
                  <option
                    key={oneDistrict.id}
                    defaultValue={hospitalProfile?.district}
                    selected={hospitalProfile?.district === oneDistrict.name}
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
                Municipality<span style={{ color: '#EA5455' }}>*</span>
              </label>
              <select
                className={`w-full h-12 p-2 border border-gray-400 ${
                  errors.municipality ? 'border-red-500' : 'border-slate-800'
                } rounded transition duration-200 ease-in-out focus:border-slate-100 mb-2`}
                {...register('municipality')}
                onChange={(e) => setMunicipality(e.target.value)}
              >
                {getMunicipalitiesByDistrictName(district).map(
                  (oneMunicipality) => (
                    <option
                      key={oneMunicipality.id}
                      defaultValue={hospitalProfile?.municipality}
                      selected={municipality === oneMunicipality.name}
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
          <div className="w-full flex flex-col lg:flex-row gap-2">
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Ward No<span style={{ color: '#EA5455' }}>*</span>
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                type="number"
                min="1"
                max="35"
                defaultValue={hospitalProfile?.wardNo}
                {...register('wardNo', {
                  required: 'Ward is required',
                  min: {
                    value: 1,
                    message: 'Wrad no cannot be less than 1',
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
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Locality
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                type="text"
                defaultValue={hospitalProfile?.hospitalAddress}
                {...register('hospitalAddress', {
                  required: 'Address is required',
                  maxLength: {
                    value: 55,
                    message: 'Address cannot be longer than 55 characters',
                  },
                })}
              />
              {errors.hospitalAddress && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.hospitalAddress.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-2">
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Hospital Representative
                <span style={{ color: '#EA5455' }}>*</span>
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                type="text"
                defaultValue={hospitalProfile?.contactPerson}
                {...register('contactPerson', {
                  required: 'Contact Person is required',
                  maxLength: {
                    value: 20,
                    message: 'cannot be longet than 20 characters',
                  },
                })}
              />
              {errors.contactPerson && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.contactPerson.message}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Hospital Email<span style={{ color: '#EA5455' }}>*</span>
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                type="text"
                defaultValue={hospitalProfile?.hospitalAddress}
                {...register('hospitalEmail', {
                  required: 'Hospital Email is Required',
                })}
              />
              {errors.hospitalAddress && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.hospitalAddress.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-2">
            <div className="w-full flex flex-col gap-2">
              <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                Contact Number<span style={{ color: '#EA5455' }}>*</span>
              </label>
              <input
                className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                type="number"
                defaultValue={hospitalProfile?.phoneNumber1}
                {...register('phoneNumber1', {
                  required: 'Phone Number is required',
                })}
              />
              {errors.phoneNumber1 && (
                <p
                  className=" m-0 w-full items-start text-sm text-red-600"
                  role="alert"
                >
                  *{errors.phoneNumber1.message}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="font-medium text-lg leading-4 px-2 py-1 text-[#008080]">
                  Landline Number
                </label>
                <input
                  className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                  type="number"
                  defaultValue={hospitalProfile?.phoneNumber1}
                  {...register('phoneNumber2')}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <button
            className="flex items-center justify-center w-3/5 lg:w-2/5 h-12 p-4 bg-button text-white rounded disabled:bg-slate-300"
            type="submit"
          >
            {loading ? <p>Loading</p> : <p>Save Changes</p>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHospital;
