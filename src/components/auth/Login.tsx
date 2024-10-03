import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../store/reduxHooks";
import { loginUser } from "../../store/userThunks";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (event.currentTarget[0] as HTMLInputElement).value;
    const password = (event.currentTarget[1] as HTMLInputElement).value;

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    dispatch(loginUser(data));
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // useEffect(() => {
  //   if (mainContent.current && isAuthenticated) {
  //     console.log("gvsd");
  //     const observer = new MutationObserver(() => {
  //       if (mainContent.current) {
  //         const firstChild = mainContent.current.children[0] as HTMLElement;
  //         const childrenCount = firstChild?.children.length;
  //         console.log(childrenCount);
  //         // Check if the first child has children
  //         if (childrenCount && childrenCount > 1) {
  //           // If you want to ensure you are reacting to changes:
  //           console.log("navigate");
  //           setNavigateNext(true); // Set loading complete if first child has multiple children
  //         }
  //       }
  //     });

  //     observer.observe(mainContent.current, {
  //       childList: true,
  //       subtree: true,
  //     });

  //     return () => {
  //       observer.disconnect(); // Clean up observer on unmount
  //     };
  //   }
  // }, [mainContent]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-gray-900/75 p-8 rounded-lg h-full shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              type={showPassword ? "text" : "password"}
              id="password"
              className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              type="submit"
              className="w-full  bg-yellow-600 text-gray-800 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm  hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-bold focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
