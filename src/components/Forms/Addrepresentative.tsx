import { useForm, SubmitHandler } from 'react-hook-form';
import { Hospital, InitialState } from '../../models/datamodels';
import {
  useAddRepresentativeMutation,
  useReadRequestQuery,
} from '../../api/apiHandler';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import RequiredField from '../Alert/RequiredField';
import { useSelector } from 'react-redux';
import { RxCross1 } from 'react-icons/rx';

export interface RepresentativeData {
  wardRepId: string;
  wardRepName: string;
  phoneNumber: string;
  secondaryContact: string;
  hospitalId: string;
  wardNo: number;
}
export default function AddRepresentative() {
  const form = useForm<RepresentativeData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();
  const [addRepresentative] = useAddRepresentativeMutation();
  const hospitalId = useSelector(
    (state: InitialState) => state.auth.hospitalId
  );

  const { data: hospitals } = useReadRequestQuery('hospitals');

  const onSubmit: SubmitHandler<RepresentativeData> = async (
    data: RepresentativeData
  ) => {
    setDisableButton(true);
    try {
      await addRepresentative(data).unwrap();
      toast.success('Successfully Added Represenatative');
      navigate('/wardrep');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setDisableButton(false);
    }
  };
  const registerConditions = {
    wardRepName: {
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
    wardNo: {
      required: 'Ward is required',
      min: {
        value: 1,
        message: 'Ward Cannot be less than 1',
      },
      max: {
        value: 35,
        message: 'Ward cannot be grearter than 35',
      },
    },
    generic: {
      required: 'This field is required',
    },
    hospitalId: {
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
    secondaryContact: {
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
      required: 'Blood Group is required',
    },
  };

  return (
    <div className="flex items-center justify-center h-full">
      <main
        className="flex flex-col justify-start items-center bg-fixed font-[Poppins] w-full h-screen"
        style={{ backgroundImage: 'url("/designRectangle.png")' }}
      >
        <div className=" w-full md:w-2/3 flex flex-col gap-4">
          <div className="flex justify-between w-full text-xl md:text-3xl font-semibold leading-6 tracking-wide border-b-2 border-[#008080] text-[#008080] px-2 pb-1">
            <p>Create a Representative</p>
            <RxCross1
              className="text-xl md:text-2xl font-semibold text-[#008080] cursor-pointer"
              onClick={() => navigate('/wardrep')}
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
                  {...register('wardRepName', registerConditions.wardRepName)}
                />
                {errors.wardRepName && (
                  <RequiredField message={errors.wardRepName.message} />
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
                    {...register('phoneNumber', registerConditions.phoneNumber)}
                  />
                  {errors.phoneNumber && (
                    <RequiredField message={errors.phoneNumber.message} />
                  )}
                </div>

                <div className="w-full flex flex-col gap-2">
                  <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                    Secondary Contact
                  </label>
                  <input
                    type="number"
                    className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    {...register(
                      'secondaryContact',
                      registerConditions.secondaryContact
                    )}
                  />
                </div>
              </div>
              <div className=" flex flex-col md:flex-row gap-2 w-full">
                <div className="w-full flex flex-col gap-2">
                  <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                    Hospital<span style={{ color: '#EA5455' }}>*</span>
                  </label>
                  <select
                    className="w-full rounded-md h-12 px-4 border"
                    {...register('hospitalId', {
                      required: 'Hospital is required',
                    })}
                  >
                    <option label="Select a hospital"></option>
                    {hospitals?.map((oneHospital: Hospital) => (
                      <option
                        label={oneHospital.hospitalName}
                        defaultValue={hospitalId}
                        selected={hospitals.hospitalId === hospitalId}
                      >
                        {oneHospital.hospitalId}
                      </option>
                    ))}
                  </select>
                  {errors.hospitalId && (
                    <p className=" m-0 w-full items-start text-sm text-red-600">
                      *{errors.hospitalId.message}
                    </p>
                  )}
                </div>

                <div className="w-full flex flex-col gap-2">
                  <label className=" w-full font-medium text-lg leading-5 text-[#008080]">
                    Ward No:<span style={{ color: '#EA5455' }}>*</span>
                  </label>
                  <input
                    min="1"
                    max="35"
                    type="number"
                    className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    {...register('wardNo', registerConditions.wardNo)}
                  />
                  {errors.secondaryContact && (
                    <RequiredField message={errors.wardNo?.message} />
                  )}
                </div>
              </div>
              <div className="w-full flex items-center justify-center md:justify-start">
                <button
                  disabled={disableButton}
                  type="submit"
                  className="flex justify-center items-center w-full md:w-1/3 h-12 p-4 bg-[#008080] text-white rounded disabled:bg-slate-300"
                >
                  Create Representative
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
