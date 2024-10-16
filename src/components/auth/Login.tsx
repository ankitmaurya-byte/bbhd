import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import { loginUser } from "../../store/userThunks";
import Spinner from "../ui/spinner/Spinner";
import { maincontainer } from "@/configs/mainContainer";
import { setCategories } from "@/store/modelConfiguration/categorySlice";
import { setReduxLocations } from "@/store/modelConfiguration/locationSlice";
import axios from "axios";
import { setsalesPattern } from "@/store/modelConfiguration/salesPatternSlice";
import { setOrganisation, setUser, setUserStatus } from "@/store/slice";
import ModelConfiguration from "@/pages/ModelConfiguration";
import { StepperProgressContext } from "@/App";
import { useAlert } from "react-alert";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const SignIn = () => {
  const mainContent = useContext(maincontainer) as MainContainerContext;
  const { setActiveStep, setIsVisible } = useContext(StepperProgressContext);
  const [showPassword, setShowPassword] = useState(false);
  const [naviagateNext, setNavigateNext] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.user);
  const alert = useAlert();
  const handleSubmit = () => {
    setIsLoading(true);
    dispatch(loginUser({ email, password }));
  };
  const loadUser = async () => {
    try {
      const cookies = document.cookie.split("; ");
      const user_id = cookies
        .find((row) => row.startsWith("user_id="))
        ?.split("=")[1];
      const response = await axios.get(`/api/user_details/${user_id}`);
      console.log(response);

      setIsLoading(false);
      dispatch(setReduxLocations(response.data.location_configs));
      dispatch(setCategories(response.data.category_configs));
      dispatch(setsalesPattern(response.data.category_configs));
      dispatch(setUser(response.data.user));
      dispatch(setOrganisation(response.data.company));
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (status === "login") {
      loadUser();
      setActiveStep((prev: number) => prev + 1);
      setIsVisible(true);
      dispatch(setUserStatus("succeeded"));
      mainContent.setPages((prev) => [...prev, ModelConfiguration]);
      mainContent.current.scroll({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      setNavigateNext(true);
    } else if (status === "failed") {
      setIsLoading(false);
      alert.error("Invalid credentials");
    }
  }, [status]);
  useEffect(() => {
    if (naviagateNext && mainContent.current) {
      console.log(mainContent.pages);
      mainContent.current.scrollTo({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      setTimeout(() => {
        mainContent.setPages((prev) =>
          prev.length >= 2 ? prev.slice(-1) : prev
        );
      }, 1000);
    }
  }, [naviagateNext]);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <Spinner isLoading={isLoading} />
      <div className="bg-gray-900/75 p-8 rounded-lg h-full shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Sign In
        </h2>
        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 placeholder:text-[16px] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              id="password"
              className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[16px] sm:text-sm"
              placeholder="Enter your password"
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 mt-[24px] flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </div>
          </div>

          {/* Stay Signed In and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-white"
              >
                Stay signed in
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Sign Up Button */}
          <div>
            <button
              onClick={handleSubmit}
              className="w-full  bg-yellow-600 text-gray-800 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm  hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-bold focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
