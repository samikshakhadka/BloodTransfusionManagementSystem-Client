import { useForm, SubmitHandler } from 'react-hook-form';
import {
  useEditRepresenattiveMutation,
  useReadRequestQuery,
} from '../../api/apiHandler';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import RequiredField from '../Alert/RequiredField';
import { RxCross1 } from 'react-icons/rx';
import { Hospital } from '../../models/datamodels';

export interface RepresentativeData {
  wardRepId: string;
  wardRepName: string;
  phoneNumber: string;
  secondaryContact: string;
  hospitalId: string;
  wardNo: number;
}
export default function EditRepresentative() {
  const { wardRepId } = useParams();
  const form = useForm<RepresentativeData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;

  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();
  const [editRepresenattive] = useEditRepresenattiveMutation();

  const { data: hospitals } = useReadRequestQuery('hospitals');
  const { data: wardRep } = useReadRequestQuery(
    `wardrepresentatives/${wardRepId}`
  );

  const onSubmit: SubmitHandler<RepresentativeData> = async (
    data: RepresentativeData
  ) => {
    wardRepId && (data.wardRepId = wardRepId);
    setDisableButton(true);
    try {
      await editRepresenattive(data).unwrap();
      toast.success('Successfully Edited Represenatative');
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

  useEffect(() => {
    if (wardRep) {
      setValue('wardRepName', wardRep.wardRepName),
        setValue('wardNo', wardRep.wardNo),
        setValue('hospitalId', wardRep.hospitalId),
        setValue('phoneNumber', wardRep.phoneNumber),
        setValue('secondaryContact', wardRep.secondaryContact);
    }
  }, [wardRep]);

  return (
    <div
      className="flex items-center justify-center w-full h-screen  bg-fixed pt-5"
      style={{ backgroundImage: 'url("/designRectangle.png")' }}
    >
      <main className="flex flex-col justify-start items-center font-[Poppins] w-full h-full">
        <div className=" w-full md:w-2/3 flex flex-col gap-8">
          <div className="flex justify-between w-full text-xl md:text-3xl font-semibold leading-6 tracking-wide border-b-2 border-[#008080] text-[#008080] px-2 pb-1">
            <p>Edit a Representative</p>
            <RxCross1
              className="text-xl :text-2xl font-semibold text-[#008080] cursor-pointer"
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
                  defaultValue={wardRep?.wardRepName}
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
                    defaultValue={wardRep?.phoneNumber}
                    {...register('phoneNumber', registerConditions.phoneNumber)}
                  />
                  {errors.phoneNumber && (
                    <RequiredField message={errors.phoneNumber.message} />
                  )}
                </div>

                <div className="w-full flex flex-col gap-2">
                  <label className="w-full font-medium text-lg leading-5 text-[#008080]">
                    Secondary Contact
                  </label>
                  <input
                    type="number"
                    className="px-4 py-2 h-12 border rounded-md p-2 transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                    defaultValue={wardRep?.secondaryContact}
                    {...register(
                      'secondaryContact',
                      registerConditions.secondaryContact
                    )}
                  />
                  {errors.secondaryContact && (
                    <RequiredField message={errors.secondaryContact.message} />
                  )}
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
                        defaultValue={wardRep?.hospitalId}
                        selected={hospitals?.hospitalId === wardRep?.hospitalId}
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
                    type="number"
                    min="1"
                    max="35"
                    defaultValue={wardRep?.wardNo}
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
                  className="flex justify-center items-center  w-2/3 md:w-1/3 h-12 p-4 bg-[#008080] text-white rounded disabled:bg-slate-300"
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
