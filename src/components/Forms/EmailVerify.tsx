import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../utils/hooks';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { LoginCredentials } from '../../models/datamodels';
import { reset } from '../../store/auth';
import Carasoul from '../Carasoul';
const EmailVerify = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const form = useForm<LoginCredentials>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const dispatch = useAppDispatch();

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    const response = await dispatch(reset(data)).unwrap();
    console.log(response);
    if (response.success) {
      toast.success(response.message);
      navigate(`/reset-password/${response.data.userId}`);
      console.log(response);
    } else {
      console.log(response);
      setError(response.message);
    }
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-start font-[Poppins]">
      <div className="w-1/2 h-full bg-white flex items-between justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-2/3 h-full flex flex-col items-start justify-evenly p-10"
        >
          <div className="flex flex-col gap-2 items-start justify-between">
            <p className="text-2xl text-left font-semibold leading-8 tracking-wide ">
              Get Started Now
            </p>
            <p>Verify your email</p>
          </div>
          <div className=" w-full flex flex-col items-start justify-around gap-10">
            <div className="w-full flex flex-col items-start justify-between gap-4">
              <label className="font-medium text-xl leading-5 px-4">
                Email Address
              </label>
              <input
                className="w-full rounded-md h-12 p-4 border transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                placeholder="Enter your email"
                type="text"
                id="email"
                {...register('email', {
                  required: 'Email is required',
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

          <div className="w-full ">
            <button
              className="w-full h-10 rounded-md flex items-center transition duration-300 justify-center text-white bg-[#25CED1] hover:bg-[#25CEE1] hover:shadow-sm hover:shadow-[#25CED1] disabled:bg-slate-400"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
          {error && (
            <p className="text-center text-lg font-medium text-red-500 leading-6">
              {error}
            </p>
          )}
        </form>
      </div>
      <div className="w-1/2 h-screen flex justify-center items-center p-2 bg-white">
        <Carasoul />
      </div>
    </div>
  );
};

export default EmailVerify;
