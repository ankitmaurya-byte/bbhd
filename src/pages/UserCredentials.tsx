import React, { useContext, useEffect, useState } from "react";

import Select, { ActionMeta, SingleValue } from "react-select";
import "react-country-state-city/dist/react-country-state-city.css";
import { Country, State, City } from "country-state-city";

import { Button } from "../components/ui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import ModelConfiguration from "./ModelConfiguration";
import Auth from "./Auth";
// import { maincontainer } from "./Home";
import { StepperProgressContext } from "../App";
import axios from "axios";

import { useAlert } from "react-alert";
import { setInfoSliceStatus } from "../store/slice";
import { addOrganisationDetails, registerUser } from "../store/userThunks";
import Spinner from "../components/ui/spinner/Spinner";
import { maincontainer } from "@/configs/mainContainer";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const UserCredentials = () => {
  const { status: orgStatus, organisationInfo } = useAppSelector(
    (state) => state.organisation
  );
  const { status: userStatus, user } = useAppSelector((state) => state.user);
  const mainContent = useContext(maincontainer) as MainContainerContext;
  const alert = useAlert();
  const { setActiveStep, setIsVisible } = useContext(
    StepperProgressContext
  ) as {
    setActiveStep: (value: React.SetStateAction<number>) => void;
  };
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // const countryCodeStyles = {
  //   DropdownIndicator: null,
  //   IndicatorSeparator: (): null => null,
  //   control: (base: React.CSSProperties) => ({
  //     ...base,
  //     margin: "5px 0 0 0",
  //   }),
  //   option: (provided: React.CSSProperties) => ({
  //     ...provided,
  //   }),
  // };

  const [naviagateNext, setNavigateNext] = useState(false);
  const displayError = (message: string) => {
    alert.removeAll();
    alert.error(message);
  };
  const [username, setUsername] = useState(user.username);
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usernameRegex = /^[a-zA-Z]{0,20}$/;
    const name = e.target.value;
    if (usernameRegex.test(name)) {
      setUsername(name);
      alert.removeAll();
    } else {
      setUsername(username);
      displayError("please enter valid username");
    }
  };
  const [role, setRole] = useState({
    value: user.role || "user",
    label: user.role || "user",
  });
  const [firstname, setFirstname] = useState(user.first_name);
  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usernameRegex = /^[a-zA-Z]{0,20}$/;
    const name = e.target.value;
    if (usernameRegex.test(name)) {
      setFirstname(name);
      alert.removeAll();
    } else {
      setFirstname((firstname) => firstname);
      displayError("please enter valid First Name");
    }
  };
  const [lastname, setLastname] = useState(user.last_name);
  const handleLastnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usernameRegex = /^[a-zA-Z]{0,20}$/;
    const name = e.target.value;
    if (usernameRegex.test(name)) {
      setLastname(name);
      alert.removeAll();
    } else {
      setLastname(lastname);
      displayError("please enter valid First Name");
    }
  };
  const [companyname, setCompanyname] = useState(organisationInfo.name);
  const handleCompanynameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usernameRegex = /^[a-zA-Z ]{0,30}$/;
    const name = e.target.value;
    if (usernameRegex.test(name)) {
      setCompanyname(name);
      alert.removeAll();
    } else {
      setCompanyname(companyname);
      displayError("please enter valid Comnany Name");
    }
  };

  const [companyemail, setCompanyemail] = useState(
    organisationInfo.contact_email
  );
  const handleComanyemailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usernameRegex = /^[a-zA-Z0-9@.+]+$/;
    const name = e.target.value;
    if (usernameRegex.test(name)) {
      setCompanyemail(name);
      alert.removeAll();
    } else {
      setCompanyname(companyemail);
      displayError("please enter valid Email");
    }
  };
  const handelCompanyemailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const emailRegex = /^[a-zA-Z0-9.]+@gmail\.com$/;
    const email = e.target.value;
    if (!emailRegex.test(email)) {
      displayError("Please enter a valid Gmail address");
    }
  };
  const [address1, setAddress1] = useState(organisationInfo.address);
  const handelArddress1Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.replace(/\s/g, "").length > 150) {
      setAddress1((address1) => address1);
      alert.removeAll();
      alert.error("max 150 Character are allowed");
    } else {
      alert.removeAll();
      setAddress1(e.target.value);
    }
  };
  const [address2, setAddress2] = useState(organisationInfo.address2);
  const handelArddress2Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.replace(/\s/g, "").length > 150) {
      setAddress2((address2) => address2);
      alert.removeAll();
      alert.error("max 150 Character are allowed");
    } else {
      alert.removeAll();
      setAddress2(e.target.value);
    }
  };
  const [pincode, setPincode] = useState(organisationInfo.pincode);
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value;
    const pinRegex = /^\d+$/;
    if (!pinRegex.test(pin)) {
      alert.removeAll();
      alert.error("enter valid pincode");
    }
    if (pin.length < 7) {
      setPincode(pin);
      alert.removeAll();
    } else {
      setPincode((prevPincode) => prevPincode);
    }
  };
  const handPincodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const pinRegex = /^\d{6}$/;
    const pin = e.target.value;
    if (!pinRegex.test(pin)) {
      setPincode((prev) => prev);
      displayError("Please enter a valid pincode");
    }
  };
  const customComponents: React.ComponentProps<typeof Select>["components"] = {
    DropdownIndicator: null, // Set this to null to remove the arrow
    IndicatorSeparator: () => null, // Removes the separator line
  };
  const [selectedDialCode, setSelectedDialCode] = useState({
    label: "+91 ",
  });
  const handelDialCode = (
    newValue: { value: string; label: string },
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    setSelectedDialCode({ label: "+" + newValue.value.replace("+", "") });
  };
  const [contactnumber, setContactNumber] = useState(
    organisationInfo.contact_phone
  );

  const handleContactNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numberRegex = /^\d{0,10}$/;
    const number = e.target.value;
    if (numberRegex.test(number)) {
      setContactNumber(number);
      alert.removeAll();
    } else {
      setContactNumber(contactnumber);
      displayError("Please enter a valid Contact number");
    }
  };
  const handNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const pinRegex = /^\d{10}$/;
    const pin = e.target.value;
    if (!pinRegex.test(pin)) {
      displayError("Please enter a valid Contact number");
    }
  };
  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedState, setSelectedState] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const countries = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  // Get states based on selected country
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }))
    : [];

  // Get cities based on selected state
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
        (city) => ({
          label: city.name,
          value: city.name,
        })
      )
    : [];
  const checkAllValidation = () => {
    // Check if username is undefined, empty, or less than 3 characters
    if (!username || username.length < 3) {
      return { message: "Invalid username", status: false };
    }

    // Check if firstname and lastname are undefined, empty, or less than 3 characters
    if (!firstname || firstname.length < 3) {
      return { message: "Invalid first name", status: false };
    }

    if (!lastname || lastname.length < 3) {
      return { message: "Invalid last name", status: false };
    }
    // Check if companyemail is a valid Gmail address
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(companyemail)) {
      return { message: "Invalid company email", status: false };
    }

    // Check if address1 is not null and not less than 20 characters
    if (!address1 || address1.length < 20) {
      return { message: "Invalid address1", status: false };
    }

    // If address2 is not null, check if its string size is greater than 15 characters
    if (address2 && address2.length <= 15) {
      return { message: "Invalid address2", status: false };
    }

    // Validate pincode for exact 6 length number
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
      return { message: "Invalid pincode", status: false };
    }

    // Validate contactNumber for 10 digits
    const contactNumberRegex = /^\d{10}$/;
    if (!contactNumberRegex.test(contactnumber)) {
      return { message: "Invalid contact number", status: false };
    }

    // Validate selected country is not null
    if (!selectedCountry) {
      return { message: "Country not selected", status: false };
    }

    // Validate selectedState and selectedCity are not null
    if (!selectedState || !selectedCity) {
      return { message: "State or city not selected", status: false };
    }

    return { message: "All validations passed", status: true };
  };
  const handelCredentialsSubmit = async () => {
    setIsLoading(true);
    try {
      const Validate = checkAllValidation();
      if (!Validate.status) {
        alert.removeAll();
        alert.error(Validate.message);
        setIsLoading(false);
        return;
      }
      const userInfo: {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        company_id?: string;
        role: string;
      } = {
        username,
        first_name: firstname,
        last_name: lastname,
        email: user.email,
        password: user.password,
        role: role.value,
      };
      const organisationInfo = {
        name: companyname,
        contact_email: companyemail,
        address: address1,
        address2: address2 ? address2 : "",
        pincode,
        contact_phone: contactnumber,
        country: selectedCountry.label,
        state: selectedState.label,
        city: selectedCity.label,
      };
      console.log(userInfo);
      console.log(organisationInfo);
      const org = await dispatch(addOrganisationDetails(organisationInfo));
      console.log(org);
      if (typeof org.payload === "string") {
        alert.error("Failed to add organisation details");
        setIsLoading(false);
        return;
      }
      userInfo.company_id = org.payload.company_id;
      const userResponse = await dispatch(registerUser(userInfo));
      console.log(userResponse);
      if (typeof userResponse.payload === "string") {
        alert.error("Failed to register user");
        setIsLoading(false);
        return;
      }
      const urlEncodedData = new URLSearchParams({
        username: username || "",
        password: user.password,
      }).toString();
      const token = await axios.post("/api/token", urlEncodedData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log(org.payload.company_id);
      console.log(userResponse.payload.user_id);
      document.cookie = `token=${
        token.data.token_type + " " + token.data.access_token
      }; path=/`;

      document.cookie = `company_id=${org.payload.company_id}; path=/`;
      document.cookie = `user_id=${userResponse.payload.user_id}; path=/`;
    } catch (error) {
      console.error("An error occurred:", error);
      alert.error("An error occurred. Please try again.");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (
      mainContent.current &&
      orgStatus === "succeeded" &&
      userStatus === "succeeded"
    ) {
      setActiveStep((prev: number) => prev + 1);
      setNavigateNext(false);
      mainContent.setPages((prev) => [...prev, ModelConfiguration]);
      dispatch(setInfoSliceStatus("idel"));
      mainContent.current.scroll({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      // console.log(mainContent.current);
      setNavigateNext(true);
    }
  }, [orgStatus, userStatus]);
  const handleNavigateBack = (component: React.FC) => {
    setNavigateNext((prev) => !prev);
    mainContent.setPages((prev) => [...prev, component]);

    mainContent.current?.scrollTo({
      left: mainContent.current.scrollWidth / mainContent.pages.length,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    setAddress1(organisationInfo.address);
    setAddress2(organisationInfo.address2);
    setPincode(organisationInfo.pincode);
    setContactNumber(organisationInfo.contact_phone);

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
  return (
    <div className="w-full grid gap-4 h-full  place-items-center grid-cols-[2fr_2fr_1fr] ">
      {/*user information*/}
      <Spinner isLoading={isLoading} />
      <div className="h-full w-full  flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          User's Info
        </h2>
        <div className="bg-gray-900/75 h-[30rem] p-8 rounded-lg w-full shadow-lg max-w-sm ">
          <form className="space-y-4">
            {/* username  */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white"
              >
                User Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your username"
              />
            </div>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                email
              </label>
              <input
                type="email"
                id="email"
                value={user?.email}
                className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
                readOnly={true}
              />
            </div>
            {/* first Name  */}
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-white"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={handleFirstnameChange}
                className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your First Name"
              />
            </div>
            {/* Last Name  */}
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={handleLastnameChange}
                className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your Last Name"
              />
            </div>
            {/* roles */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-white"
              >
                Role
              </label>
              <Select
                options={[
                  { value: "user", label: "user" },
                  { value: "admin", label: "admin" },
                ]}
                placeholder="Select Role"
                value={role}
                // Use correct onChange handler to set the role
                onChange={(selectedOption) => setRole(selectedOption)}
                menuPlacement="top" // To make the dropdown menu appear above
              />
            </div>
          </form>
        </div>
      </div>
      {/* organisationInfo /> */}
      <div className="h-full w-full  flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Organisation's Info
        </h2>
        <div className="bg-gray-900/75  h-[30rem]   p-8 rounded-lg w-full shadow-lg max-w-sm  scrollbar-hide">
          <form
            style={{ scrollbarWidth: "none" }}
            className="space-y-4 overflow-scroll h-full scrollbar-hide"
          >
            {/* Company name Field */}
            <div>
              <label
                htmlFor="companyname"
                className="block text-sm font-medium text-white"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyname"
                value={companyname}
                onChange={handleCompanynameChange}
                className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your company name"
              />
            </div>
            {/* Company name Field */}
            <div>
              <label
                htmlFor="companyemail"
                className="block text-sm font-medium text-white"
              >
                Contact Email
              </label>
              <input
                type="text"
                id="companyemail"
                value={companyemail}
                onChange={handleComanyemailChange}
                onBlur={handelCompanyemailBlur}
                className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your company Email"
              />
            </div>
            {/* address 1 Field */}
            <div>
              <label
                htmlFor="address1"
                className="block text-sm font-medium text-white"
              >
                Address 1
              </label>
              <textarea
                id="address1"
                value={address1}
                onChange={handelArddress1Change}
                className="mt-1 resize-none p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your address Eg: 3180 Danforth Ave, Toronto,Ontario "
              ></textarea>
            </div>
            {/* address 2 Field */}
            <div>
              <label
                htmlFor="address2"
                className="block text-sm font-medium text-white"
              >
                Address 2 (Optional)
              </label>
              <textarea
                id="address2"
                value={address2}
                onChange={handelArddress2Change}
                className="mt-1 resize-none p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your address Eg: 3180 Danforth Ave, Toronto,Ontario "
              ></textarea>
            </div>
            {/* adress pincode number */}
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-white"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                value={pincode}
                onChange={handlePincodeChange}
                onBlur={handPincodeBlur}
                className="mt-1 p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Adress pincode"
              />
            </div>

            {/* Company contact number */}
            <div>
              <label
                htmlFor="contactnumber"
                className="block text-sm font-medium text-white"
              >
                Contact Number
              </label>
              <div className="grid items-center grid-cols-[1fr_4fr]">
                <Select
                  options={Country.getAllCountries().map((country) => ({
                    label: `${country.name} (${country.phonecode})`,
                    value: country.phonecode,
                    isoCode: country.isoCode,
                  }))}
                  components={customComponents}
                  // styles={countryCodeStyles}
                  menuPlacement="top"
                  placeholder="+ 91"
                  value={selectedDialCode}
                  onChange={handelDialCode}
                />
                <input
                  type="text"
                  id="contactnumber"
                  value={contactnumber}
                  onChange={handleContactNumberChange}
                  onBlur={handNumberBlur}
                  className=" p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your Contact number"
                />
              </div>
            </div>
            {/* countries */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-white"
              >
                country
              </label>
              <Select
                options={countries}
                placeholder="Select Country"
                value={selectedCountry}
                // styles={customStyles}
                menuPlacement="top"
                onChange={(option) => {
                  setSelectedCountry(option);
                  setSelectedState(null); // Reset state and city when changing country
                  setSelectedCity(null);
                }}
              />
            </div>
            {/* states */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-white"
              >
                state
              </label>
              <Select
                options={states}
                placeholder="Select State"
                value={selectedState}
                onChange={(option) => {
                  setSelectedState(option);
                  setSelectedCity(null); // Reset city when changing state
                }}
                // styles={customStyles}
                menuPlacement="top"
                isDisabled={!selectedCountry}
              />
            </div>
            {/* city */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-white"
              >
                city
              </label>
              <Select
                options={cities}
                placeholder="Select City"
                value={selectedCity}
                onChange={setSelectedCity}
                isDisabled={!selectedState}
                // styles={customStyles} // Applying custom styles
                menuPlacement="top" // This makes the menu drop-up
              />
            </div>
          </form>
        </div>
      </div>
      <div className="justify-center w-full gap-4 flex flex-col">
        <div className="relative flex w-full">
          <Button
            disabled={isLoading}
            onClick={handelCredentialsSubmit}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Save & Submit
          </Button>
          <FontAwesomeIcon
            className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold absolute right-[10%] top-1/2 transform -translate-y-1/2"
            icon={faArrowRight}
          />
        </div>
        {userStatus !== "unknown" ? (
          <div className="relative flex w-full">
            <Button
              disabled={isLoading}
              className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
              onClick={() => {
                setActiveStep((prev: number) => prev + 1);
                handleNavigateBack(ModelConfiguration);
              }}
            >
              next
            </Button>
            <FontAwesomeIcon
              className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold absolute right-[10%] top-1/2 transform -translate-y-1/2"
              icon={faArrowRight}
            />
          </div>
        ) : (
          <div className="relative flex w-full">
            <Button
              disabled={isLoading}
              className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
              onClick={() => {
                setIsVisible(false);
                handleNavigateBack(Auth);
              }}
            >
              Back
            </Button>
            <FontAwesomeIcon
              className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold absolute right-[10%] top-1/2 transform -translate-y-1/2"
              icon={faArrowRight}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default UserCredentials;
