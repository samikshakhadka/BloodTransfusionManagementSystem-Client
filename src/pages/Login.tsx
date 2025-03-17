import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../utils/hooks";
import { loginUser } from "../store/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { LoginCredentials } from "../models/datamodels";
import { GoEye, GoEyeClosed } from "react-icons/go";
import Carasoul from "../components/Carasoul";

const Login = () => {
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
    const response = await dispatch(loginUser(data)).unwrap();
    console.log(response);
    if (response.success) {
      toast.success(response.message);
      navigate("/");
    } else {
      console.log(response);
      setError("Invalid login credentials");
    }
    setLoading(false);
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-start font-[Poppins]">
      <div className="w-full lg:w-1/2 h-full bg-white flex items-between justify-center">
        <form
          className="w-full lg:w-2/3 h-full flex flex-col items-start justify-evenly p-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2 items-start justify-between">
            <p className="text-2xl text-left font-semibold leading-8 tracking-wide">
              Get Started Now
            </p>
            <p>Login to the dashboard</p>
          </div>
          <div className="w-full flex flex-col items-start justify-around gap-10">
            <div className="w-full flex flex-col items-start justify-between gap-4">
              <label className="font-medium text-xl leading-5 px-4">
                Email Address
              </label>
              <div className="w-full relative ">
                <input
                  className="w-full rounded-md h-12 p-4 border transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5]"
                  placeholder="youraddress@gmail.com"
                  type="text"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: "Please enter a valid Email Address",
                    },
                  })}
                />
                {errors.email && (
                  <p
                    className=" m-0 w-full items-start text-sm text-red-600"
                    role="alert"
                  >
                    *{errors.email.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col items-start justify-between gap-4">
              <div className="w-full flex justify-between items-center">
                <label className="font-medium text-xl leading-5 px-4">
                  Password
                </label>
              </div>
              <div className="w-full relative ">
                <input
                  className="w-full rounded-md h-12 p-4 border transition duration-300 focus:outline-none focus:border-[#25CED1] focus:ring focus:ring-[#cbf1f5] relative"
                  placeholder="Enter password"
                  id="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p
                    className=" m-0 w-full items-start text-sm text-red-600"
                    role="alert"
                  >
                    *{errors.password.message?.toString()}
                  </p>
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
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="w-full">
            <button
              className="w-full h-10 rounded-md flex items-center transition duration-300 justify-center text-white bg-[#25CED1] hover:bg-[#25CEE1] hover:shadow-sm hover:shadow-[#25CED1] disabled:bg-slate-300"
              disabled={loading}
            >
              {loading ? <span>Logging in... </span> : <span>Login Now</span>}
            </button>
          </div>
        </form>
      </div>
      <div className="w-1/2 h-screen lg:flex justify-center items-center p-2 bg-white hidden">
        <Carasoul />
      </div>
    </div>
  );
};

export default Login;
