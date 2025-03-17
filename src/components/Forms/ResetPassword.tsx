import { useForm, SubmitHandler } from "react-hook-form";
import { ResetPasswordData } from "../../models/datamodels";
import {
  useReadRequestQuery,
  useResetPasswordMutation,
} from '../../api/apiHandler';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import Loading from '../Loading/Loading';
import { GoEye, GoEyeClosed } from 'react-icons/go';
import RequiredField from '../Alert/RequiredField';

export default function ResetPassword() {
  const form = useForm<ResetPasswordData>({});
  const { userId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const {
    data: userData,
    isLoading,
    error,
  } = useReadRequestQuery(`users/${userId}`);
  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();
  const onSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
    data.email = userData.email;
    userId && (data.userId = userId);

    setDisableButton(true);

    if (data.password === data.confirmPassword) {
      try {
        await resetPassword(data).unwrap();
        toast.success("Successful password reset");
        navigate("/admin");
      } catch (error) {
        toast.error('Failed to reset password');
      } finally {
        setDisableButton(false);
      }
    } else {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      setDisableButton(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const registerConditions = {
    generic: {
      required: 'This field is required',
    },
    password: {
      required: 'This field is required',
      maxLength: {
        value: 32,
        message: 'Max Length is 32',
      },
      minLength: {
        value: 8,
        message: 'Min length is 8',
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
        message:
          'Invalid password, please have a uppercase, lowercase and a special character',
      },
    },
  };
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <p>Unable to fetch data of this particular donor</p>;
  } else {
    return (
      <>
        <div
          className="w-full h-full flex items-center justify-center font-[Poppins] bg-fixed"
          style={{ backgroundImage: 'url("/designRectangle.png")' }}
        >
          <div className="w-full h-full flex justify-center">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-1/2 h-full flex flex-col items-start justify-evenly p-10 gap-5"
            >
              <div className="flex flex-col gap-2 items-start justify-between">
                <p className="text-2xl text-left font-semibold leading-8 tracking-wide">
                  Password Reset for {userData.donor.donorName}
                </p>
                <p>Reset Password</p>
              </div>
              <div className="w-full flex flex-col items-start justify-around gap-10">
                <div className="w-full flex flex-col items-start justify-between gap-4">
                  <label className="font-medium text-xl leading-5 px-4">
                    Password
                  </label>

                  <div className="w-full relative ">
                    <input
                      className="w-full rounded-md h-12 p-4 border transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5] relative"
                      placeholder="Enter password"
                      id="Password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', registerConditions.password)}
                    />
                    {errors.password && (
                      <RequiredField message={errors.password.message} />
                    )}
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                      {showPassword ? (
                        <GoEye
                          className="text-xl text-[#25CED1] delay-100 ease-in-out"
                          onClick={toggleVisibility}
                        />
                      ) : (
                        <GoEyeClosed
                          className="text-xl text-[#25CED1] delay-100 ease-in-out"
                          onClick={toggleVisibility}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col items-start justify-between gap-4">
                  <label className="font-medium text-xl leading-5 px-4">
                    Confirm Password
                  </label>

                  <div className="w-full relative ">
                    <input
                      className="w-full rounded-md h-12 p-4 border transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5] relative"
                      placeholder="Confirm password"
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword ? (
                      <p
                        className=" m-0 w-full items-start text-sm text-red-600"
                        role="alert"
                      >
                        Password does not match
                      </p>
                    ) : null}
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                      {showPassword ? (
                        <GoEye
                          className="text-xl text-[#25CED1] delay-100 ease-in-out"
                          onClick={toggleVisibility}
                        />
                      ) : (
                        <GoEyeClosed
                          className="text-xl text-[#25CED1] delay-100 ease-in-out"
                          onClick={toggleVisibility}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="
                disabled:bg-slate-700
                w-full h-10 rounded-md flex items-center transition duration-300 justify-center text-white bg-[#25CED1] hover:bg-[#25CEE1] hover:shadow-sm hover:shadow-[#25CED1]"
                disabled={disableButton}
              >
                {disableButton ? <p>Loading..</p> : <p>Reset Password</p>}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
}
