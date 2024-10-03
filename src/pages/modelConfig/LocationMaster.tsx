import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faGears,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
// import { maincontainer } from "../Home";
import ModelConfiguration from "../ModelConfiguration";

import { useAppDispatch, useAppSelector } from "../../store/reduxHooks";
import { setModelProgress } from "../../store/modelConfiguration/modelSlice";
import { addLocations } from "../../store/userThunks";
import { setLocationStatus } from "../../store/modelConfiguration/locationSlice";
import { useAlert } from "react-alert";
import Spinner from "../../components/ui/spinner/Spinner";
import { maincontainer } from "@/configs/mainContainer";
interface MainContainerContext {
  current: HTMLDivElement | null;
  pages: React.FC[];
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
}
const ConfigurationCard = ({
  handelLocationChange,
  handelLatitudeChange,
  handelLongitudeChange,
  latitude,
  longitude,
  location,
  index,
}: {
  handelLocationChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handelLatitudeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handelLongitudeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  latitude: string[];
  longitude: string[];
  location: string[];
  index: number;
}) => {
  const alert = useAlert();
  return (
    <div className="flex items-center justify-between px-8 py-1  bg-gray-900 rounded-lg  relative  mb-2 shadow-lg">
      <div className="absolute text-white left-3">{index + 1}</div>
      {/* location Field */}
      <div>
        <input
          type="text"
          id="location"
          className=" p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="eg: mumbai, india"
          value={location[index]}
          onChange={(e) => handelLocationChange(e, index)}
        />
      </div>
      {/* Latitude Field */}
      <div>
        <input
          type="text"
          id="latitude"
          className=" p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="eg: 122.4194° W"
          value={latitude[index]}
          onChange={(e) => handelLatitudeChange(e, index)}
          onBlur={(e) => {
            const latitudeRegex = /^-?(90|[1-8]?[0-9]).\d{1,5}$/;
            if (!latitudeRegex.test(e.target.value) && e.target.value !== "") {
              alert.removeAll();
              alert.error("Invalid latitude");
            }
          }}
        />
      </div>
      {/* Longitude Field */}
      <div>
        <input
          type="text"
          id="longitude"
          className="p-2 text-gray-900 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="eg: 72°51′34.09″ E"
          onChange={(e) => handelLongitudeChange(e, index)}
          value={longitude[index]}
          onBlur={(e) => {
            const latitudeRegex = /^-?(180|1[1-7][0-9]|\d{1,2}).\d{1,5}$/;
            if (!latitudeRegex.test(e.target.value) && e.target.value !== "") {
              alert.removeAll();
              alert.error("Invalid latitude");
            }
          }}
        />
      </div>
    </div>
  );
};
const ReviewCard = ({
  latitude,
  longitude,
  location,
  index,
}: {
  latitude: string[];
  longitude: string[];
  location: string[];
  index: number;
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-900 rounded-lg px-24 text-white  relative  mb-2 shadow-lg">
      <div className="absolute text-white left-3">{index + 1}</div>
      {/* location Field */}
      <div>{location[index]}</div>
      {/* Latitude Field */}
      <div>{latitude[index]}</div>
      {/* Longitude Field */}
      <div>{longitude[index]}</div>
    </div>
  );
};
const LocationMaster = () => {
  const { status, locations } = useAppSelector(
    (state) => state.modelConfiguration.LocationMaster
  );
  const reduxLocation = [];
  const reduxLongitude = [];
  const reduxLatitude = [];
  for (const [key, { location, longitude, latitude }] of Object.entries(
    locations
  )) {
    reduxLocation.push(location);
    reduxLongitude.push(longitude.toString());
    reduxLatitude.push(latitude.toString());
  }
  const mainContent = useContext(maincontainer) as MainContainerContext;
  const [navigateBack, setNavigateBack] = useState(false);
  const [numberOfLocations, setNumberOfLocations] = useState(
    locations.length > 8 ? locations.length : 8
  );
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const alert = useAlert();

  const [location, setLocation] = useState<string[]>(reduxLocation);
  const [longitude, setLongitude] = useState<(string | null)[]>(reduxLongitude);
  const [latitude, setLatitude] = useState<(string | null)[]>(reduxLatitude);
  const handelLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const tempLocation = [...location];
    const inputValue = e.currentTarget.value;
    const letterOnlyRegex = /^[A-Za-z\s ]*$/;
    if (letterOnlyRegex.test(inputValue)) {
      if (inputValue.length <= 20) {
        tempLocation[index] = inputValue.toUpperCase();
        setLocation(tempLocation);
        alert.removeAll();
      } else {
        alert.removeAll();
        alert.error("Location name should not exceed 20 characters");
      }
    } else {
      alert.removeAll();
      alert.error("Please use alphabets only");
    }
  };
  const handelLongitudeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.currentTarget.value;
    const longitudeRegex =
      /^-?(180|1[1-7][0-9]|\d{0,2})(\d{1,2}[.]{1}\d{0,5})?$/;
    if (longitudeRegex.test(value) || value === "") {
      const tempLongitude = [...longitude];
      value.replace(".", "");

      tempLongitude[index] = value === "" ? null : value;
      setLongitude(tempLongitude);
      alert.removeAll();
    } else {
      setLongitude((longitude) => longitude);
      alert.removeAll();
      alert.error("Invalid latitude: must be a valid number");
    }
  };

  const handelLatitudeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.currentTarget.value;

    const latitudeRegex = /^-?(90|[1-8]?[0-9]|\d{0,1})(\d{1,2}[.]{1}\d{0,5})?$/;
    if (latitudeRegex.test(value) || value === "") {
      const tempLatitude = [...latitude];
      value.replace(".", "");
      tempLatitude[index] = value === "" ? null : value;
      setLatitude(tempLatitude);
      alert.removeAll();
    } else {
      setLatitude((latitude) => latitude);
      alert.removeAll();
      alert.error("Invalid latitude: must be a valid number");
    }
  };
  const handleNavigateBack = () => {
    setNavigateBack((prev) => !prev);
    mainContent.setPages((prev) => [...prev, ModelConfiguration]);
    mainContent.current.scrollTo({
      left: mainContent.current.scrollWidth / mainContent.pages.length,
      behavior: "smooth",
    });
  };
  // const handelSaveLocation = () => {
  //   const locationData = {};
  //   for (let i = 0; i < numberOfLocations; i++) {
  //     locationData[`input${i}`] = {
  //       location: location[i],
  //       latitude: latitude[i],
  //       longitude: longitude[i],
  //     };
  //   }
  // };
  const handelLocationsubmit = async () => {
    // const hasUndefined = location.some((loc, index) =>
    //   loc === undefined || longitude[index] === undefined || latitude[index] === undefined
    // );

    // if (hasUndefined) {
    //   console.log("There are undefined values in the arrays");
    // } else {
    //   console.log("All values are defined");
    // }
    setIsLoading(true);
    const locationData: {
      locations: string[];
      latitudes: number[];
      longitudes: number[];
    } = { locations: [], latitudes: [], longitudes: [] };
    // const setLoca: {
    //   [key: string]: {
    //     location: string;
    //     latitude: number;
    //     longitude: number;
    //   };
    // } = {};

    // for (let i = 0; i < location.length; i++) {
    //   setLoca[`input[${i}]`] = {
    //     location: location[i],
    //     latitude: Number(latitude[i]),
    //     longitude: Number(longitude[i]),
    //   };
    // }
    console.log(location);
    console.log(latitude);
    console.log(longitude);
    for (let i = 0; i < numberOfLocations; i++) {
      if (!location[i] || !latitude[i] || !longitude[i]) {
        continue;
      }
      const longitudeRegex = /^-?(180|1[1-7][0-9]|\d{1,2})([.]{1}\d{1,5})$/;
      const latitudeRegex = /^-?(90|[1-8]?[0-9])([.]{1}\d{1,5})$/;
      if (
        !latitudeRegex.test(latitude[i]) ||
        !longitudeRegex.test(longitude[i])
      ) {
        alert.error("fill details properly");
        setIsLoading(false);
        return;
      }
      locationData.locations.push(location[i]);
      locationData.latitudes.push(Number(latitude[i]));
      locationData.longitudes.push(Number(longitude[i]));
      // setLoca[`input[${i}]`] = {
      //   location: location[i],
      //   latitude: Number(latitude[i]),
      //   longitude: Number(longitude[i]),
      // };
    }
    console.log(locationData);
    if (locationData.locations.length === 0) {
      alert.removeAll();
      setIsLoading(false);
      alert.error("please enter location data before submit");
      return;
    }
    dispatch(addLocations(locationData));
    // dispatch(setReduxLocations(setLoca));
    // const response = await axios.get(
    //   `https://fastapi-dev-1-hneke7a2fvf0hyba.eastus-01.azurewebsites.net/api/companies/4`
    // );
    // console.log(response);
    // dispatch(addModelProcess({ ...modelProcess, location: true }));
    // dispatch(setModelProgress("location"));
  };
  useEffect(() => {
    if (mainContent.current && status === "succeeded") {
      setIsLoading(false);
      dispatch(setModelProgress("location"));
      dispatch(setLocationStatus("idel"));

      mainContent.setPages((prev) => [...prev, ModelConfiguration]);
      mainContent.current.scroll({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      // console.log(mainContent.current);
      setNavigateBack(true);
    }
  }, [status]);
  useEffect(() => {
    console.log("navigateBack" + navigateBack);
    if (mainContent.current && navigateBack) {
      setNavigateBack((prev) => !prev);
      console.log(mainContent.pages);
      mainContent.current.scrollTo({
        left: mainContent.current.scrollWidth / mainContent.pages.length,
        behavior: "smooth",
      });
      // setTimeout(() => {
      //   mainContent.current.scrollTo({
      //     left: 0,
      //     behavior: "smooth",
      //   });
      // }, 100);
      setTimeout(() => {
        mainContent.setPages((prev) =>
          prev.length >= 2 ? prev.slice(-1) : prev
        );
      }, 1000);
    }
  }, [navigateBack]);
  return (
    <div className=" h-full grid grid-cols-[3fr_1fr] items-center justify-center  w-full ">
      <Spinner isLoading={isLoading} />
      <div className="m-auto h-[95%] w-[86%]">
        <div className="flex mb-3 items-center">
          <FontAwesomeIcon
            className="h-8 w-8 text-orange-500 mr-2"
            icon={faGears}
          />

          <h2 className="text-white text-2xl font-bold">Location Master</h2>
        </div>
        <div className="bg-gray-900 h-[93%] bg-opacity-75 px-8 py-2 pt-6 rounded-lg max-w-3xl w-full">
          <div className="flex mb-2 space-x-2">
            <label className="text-lg font-semibold text-gray-300">
              Enter the Number of Locations to be Created
            </label>
            <input
              type="number"
              className="p-2 h-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(40,50,86)] focus:border-transparent w-[4rem]  text-gray-900"
              placeholder="e.g., 5"
              min="1"
              value={numberOfLocations}
              onChange={(e) => setNumberOfLocations(Number(e.target.value))}
            />
          </div>
          <div className="h-[29rem] overflow-auto hide-scrollbar">
            {" "}
            <div className="grid grid-cols-3 place-items-center px-4 py-1 mb-2 text-xl text-white rounded-lg shadow-lg bg-gray-800 sticky top-0 z-10">
              <div>Location</div>
              <div>Latitude</div>
              <div>Longitude</div>
            </div>
            {!edit &&
              [...Array(numberOfLocations)].map((_, index) => (
                <ConfigurationCard
                  handelLocationChange={handelLocationChange}
                  handelLongitudeChange={handelLongitudeChange}
                  handelLatitudeChange={handelLatitudeChange}
                  latitude={latitude}
                  longitude={longitude}
                  location={location}
                  index={index}
                  key={index}
                />
              ))}
            {edit &&
              [...Array(location.length)].map((_, index) => (
                <ReviewCard
                  latitude={latitude}
                  longitude={longitude}
                  location={location}
                  index={index}
                  key={index}
                />
              ))}
          </div>
        </div>
      </div>

      <div className=" gap-4 flex items-center justify-center flex-col">
        {edit ? (
          <Button
            disabled={isLoading}
            onClick={() => {
              setEdit(false);
            }}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32"
          >
            Edit
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            onClick={() => {
              setEdit(true);
            }}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32"
          >
            Review
          </Button>
        )}

        <div className="relative flex w-full">
          <Button
            disabled={isLoading}
            onClick={handelLocationsubmit}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            submit
          </Button>

          <FontAwesomeIcon
            size="lg"
            className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold absolute right-[15%] top-1/2 transform -translate-y-1/2"
            icon={faCircleArrowRight}
          />
        </div>
        <div className="relative flex w-full">
          <FontAwesomeIcon
            size="lg"
            className="cursor-pointer text-yellow-600 hover:text-yellow-700 font-bold absolute left-[15%] top-1/2 transform -translate-y-1/2"
            icon={faCircleArrowLeft}
          />
          <Button
            disabled={isLoading}
            onClick={handleNavigateBack}
            className="bg-yellow-600 text-gray-800 hover:bg-yellow-700 font-bold w-32 m-auto"
          >
            Back to main
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationMaster;
