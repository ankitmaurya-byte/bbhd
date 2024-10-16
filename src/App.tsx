import { createContext, useEffect, useState } from "react";
import Home from "./pages/Home";
import webfont from "webfontloader";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import PrepareModel from "./pages/prepareModel/PrepareModel";
import RunModel from "./pages/prepareModel/RunModel";
import ViewsOption from "./pages/prepareModel/ViewsOption";
import axios from "axios";
import Auth from "./pages/Auth";
import ModelConfiguration from "./pages/ModelConfiguration";
import { setOrganisation, setUser, setUserStatus } from "./store/slice";
import { setsalesPattern } from "./store/modelConfiguration/salesPatternSlice";
import { setCategories } from "./store/modelConfiguration/categorySlice";
import { setReduxLocations } from "./store/modelConfiguration/locationSlice";
import { useAppDispatch, useAppSelector } from "./store/reduxHooks";
import Spinner from "./components/ui/spinner/Spinner";
import Img from "./components/LasyLoading";
import ShipmentChart from "./pages/charts/Shipment";
export const StepperProgressContext = createContext({
  isVisible: false,
  setIsVisible: (value: boolean | ((prevState: boolean) => boolean)) => {},
  activeStep: 0,
  setActiveStep: (value: number | ((prevState: number) => number)) => {},
});
const useWebFontLoader = () => {
  useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Open Sans", "Lato", "Montserrat", "Merriweather"],
      },
    });
    // Add any other initialization logic here if needed
  }, []);
};
function App() {
  const { status } = useAppSelector((state) => state.user);
  // const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cookies = document.cookie.split("; ");
  const user_id = cookies
    .find((row) => row.startsWith("user_id="))
    ?.split("=")[1];

  const [pages, setPages] = useState<React.FC[]>(user_id ? [] : [Auth]);
  const [activeStep, setActiveStep] = useState(0);
  // useWebFontLoader();

  const dispatch = useAppDispatch();
  const loadUser = async () => {
    try {
      // const userid = document.cookie
      //   .split(";")
      //   .find((cookie) => cookie.trim().startsWith("token="))
      // .split("=")[1];
      // Get cookies for user_id and company_id
      console.log(user_id);
      const response = await axios.get(`/api/user_details/${user_id}`);
      console.log(response);
      if (response.data) {
        // setPages([InventoryNorms2]);
        setIsVisible(true);
        setActiveStep(1);
        setPages([ModelConfiguration]);
      } else {
        setPages([Auth]);
        // setPages([UserCredentials]);
      }
      setIsLoading(false);
      dispatch(setReduxLocations(response.data.location_configs));
      dispatch(setCategories(response.data.category_configs));
      dispatch(setsalesPattern(response.data.category_configs));
      dispatch(setUser(response.data.user));
      dispatch(setOrganisation(response.data.company));
    } catch (err) {
      setPages([Auth]);
      // setPages([UserCredentials]);
      console.log(err);
      setIsLoading(false);
    }
  };
  useWebFontLoader();
  useEffect(() => {
    if (!user_id) {
      setIsLoading(false);
    } else {
      loadUser();
    }
  }, []);
  useEffect(() => {
    if (status === "logout") {
      dispatch(setUserStatus("unknown"));
      setPages([Auth]);
      setActiveStep(0);
      console.log(status);
    }
  }, [status]);

  return (
    <StepperProgressContext.Provider
      value={{ isVisible, setIsVisible, activeStep, setActiveStep }}
    >
      <Header setPages={setPages} pages={pages} />
      {isLoading && (
        <div>
          <div className="absolute inset-0 h-full w-full z-50"></div>
          <Img
            src="/background-image.jpg"
            alt="Product Image"
            className="absolute -z-20 inset-0 h-full w-full object-cover"
          />
          <Spinner isLoading={isLoading} />
        </div>
      )}
      <div className="relative">
        <Routes>
          <Route
            path="/"
            element={<Home setPages={setPages} pages={pages} />}
          />
          <Route path="/user" element={<PrepareModel />} />
          <Route path="/runmodel" element={<RunModel />} />
          <Route path="/chart" element={<ViewsOption />} />
          {/* <Route path="/shipment" element={<ShipmentChart />} /> */}
        </Routes>
      </div>
    </StepperProgressContext.Provider>
  );
}

export default App;
