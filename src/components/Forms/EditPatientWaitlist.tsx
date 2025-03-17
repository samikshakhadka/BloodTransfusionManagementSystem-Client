import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  useReadRequestQuery,
  useEditPatientMutation,
} from '../../api/apiHandler';
import { BloodGroup } from '../../models/datamodels';
import { toast } from 'react-toastify';
import RequiredField from '../Alert/RequiredField';
import { nepalJson } from '../../data/nepal';
import { Hospital } from '../../models/datamodels';
import {
  getDistrictsByProvinceName,
  getMunicipalitiesByDistrictName,
} from '../../data/province';
import { useParams, useNavigate } from 'react-router';
import { EditPatientwaitlist } from '../../models/datamodels';
import Loading from '../Loading/Loading';
import { RxCross1 } from 'react-icons/rx';

export default function EditPatientWaitlist() {
  const form = useForm<EditPatientwaitlist>();
  const { patientId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;
  const { data: bloodGroup } = useReadRequestQuery('BloodGroups');
  const { data: hospital } = useReadRequestQuery('Hospitals');
  const {
    data: patientData,
    isLoading,
    error,
  } = useReadRequestQuery(`patientwaitlists/${patientId}`);

  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();
  const [editPatient] = useEditPatientMutation();
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');

  useEffect(() => {
    if (patientData) {
      setProvince(patientData.province);
      setDistrict(patientData.district);
      setMunicipality(patientData.municipality);
      setValue('district', patientData.district);
      setValue('municipality', patientData.municipality);
    }
  }, [patientData, setValue]);

  const onSubmit: SubmitHandler<EditPatientwaitlist> = async (data) => {
    data.patientId = patientData.patientId;
    setDisableButton(true);
    try {
      await editPatient(data).unwrap();
      toast.success('Successfully edited patient');
      navigate('/patientwaitlist');
    } catch (error) {
      toast.error('Failed to Edit patient');
    } finally {
      setDisableButton(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <p>Unable to fetch data of this particular patient</p>;
  } else {
    return (
      <div className="flex items-center justify-center h-full">
        <main
          className="flex flex-col justify-center items-center bg-fixed font-[Poppins] w-full h-full"
          style={{ backgroundImage: 'url("/designRectangle.png")' }}
        >
          <div className=" w-full md:w-2/3 mb-5 pb-2 flex flex-col gap-4">
            <div className=" flex justify-between w-full text-xl md:text-3xl font-semibold leading-6 tracking-wide border-b-2 border-[#008080] text-[#008080] px-2 pb-1">
              <p>Edit a PatientList</p>
              <RxCross1
                className="text-xl md:text-2xl font-semibold text-[#008080] cursor-pointer"
                onClick={() => navigate('/patientwaitlist')}
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
                    type="text"
                    defaultValue={patientData.patientName}
                    {...register('patientName', { required: true })}
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
                      Phone Number<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      className=" px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      defaultValue={patientData.phoneNumber}
                      {...register('phoneNumber', {
                        required: 'Phone Number is required',
                        pattern: {
                          value: /^\d{10}$/,
                          message: 'Phone Number should be 10 digits.',
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
                      Blood Group<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      className=" w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5] "
                      {...register('bloodGroupId', { required: true })}
                      defaultValue={patientData.bloodGroup.bloodGroupId}
                    >
                      {bloodGroup?.map((item: BloodGroup) => (
                        <option
                          key={item.bloodGroupId}
                          label={item.bloodGroupName}
                          defaultValue={patientData.bloodGroup.bloodGroupId}
                          selected={
                            item.bloodGroupName ===
                            patientData.bloodGroup.bloodGroupName
                          }
                        >
                          {item.bloodGroupId}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-2">
                  <div className="w-full flex flex-col gap-2">
                    <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                      Hospital<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      className=" w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5] "
                      {...register('hospitalId', { required: true })}
                      defaultValue={patientData.hospital.hospitalId}
                    >
                      {hospital?.map((item: Hospital) => (
                        <option
                          key={item.hospitalId}
                          label={item.hospitalName}
                          defaultValue={patientData.hospital.hospitalId}
                          selected={
                            item.hospitalName ===
                            patientData.hospital.hospitalName
                          }
                        >
                          {item.hospitalId}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                      Province<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('province')}
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      defaultValue={patientData.province}
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
                      District<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <select
                      className="w-full border rounded-md p-2 h-12 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      {...register('district', {
                        required: 'District Name is required',
                      })}
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      defaultValue={patientData.district}
                    >
                      <option value="">Select District</option>
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
                      {...register('municipality', {
                        required: 'Municipality Name is required',
                      })}
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      defaultValue={patientData.municipality}
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
                      Ward<span style={{ color: '#EA5455' }}>*</span>
                    </label>
                    <input
                      min="1"
                      max="35"
                      type="number"
                      className="w-full h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                      defaultValue={patientData.wardNo}
                      {...register('wardNo', {
                        required: 'Ward No. is required',
                        pattern: {
                          value: /^\d+$/,
                          message: 'Ward No. should be a number.',
                        },
                      })}
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
                    className="w-full h-24 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    defaultValue={patientData.remarks}
                    {...register('remarks')}
                  />
                </div>
                <div className="flex gap-4 w-full justify-center md:justify-start">
                  <button
                    className="flex items-center justify-center w-2/3 md:w-1/3 h-12 p-4 bg-[#008080] text-white rounded disabled:bg-slate-300"
                    disabled={disableButton}
                    type="submit"
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
