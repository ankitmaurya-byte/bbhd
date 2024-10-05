import ContentWrapper from "../components/ContentWrapper";

import ModelConfiguration from "./ModelConfiguration";
import Auth from "./Auth";
import { useContext, useEffect, useRef, useState } from "react";
import { clearInfo, clearUser, setOrganisation, setUser } from "../store/slice";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import Img from "../components/LasyLoading";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { StepperProgressContext } from "../App";
import {
  clearLocation,
  setReduxLocations,
} from "../store/modelConfiguration/locationSlice";
import {
  clearCategories,
  setCategories,
} from "../store/modelConfiguration/categorySlice";
import { maincontainer } from "@/configs/mainContainer";
import {
  clearSalesPattern,
  setsalesPattern,
} from "../store/modelConfiguration/salesPatternSlice";
import { clearModelProcess } from "../store/modelConfiguration/modelSlice";
import { clearWarehouse } from "../store/modelConfiguration/warehouseSlice";
import Spinner from "@/components/ui/spinner/Spinner";
// import Spinner from "../components/ui/spinner/Spinner";
// interface MainContainerContext {
//   current: HTMLDivElement | null;
//   pages: React.FC[];
//   setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
// }
// const maincontainer = createContext<MainContainerContext | null>(null);
type Props = {
  setPages: React.Dispatch<React.SetStateAction<React.FC[]>>;
  pages: React.FC[];
};
const Home = ({ setPages, pages }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  // const [smapleImages, setSampleImages] = useState([])
  // addSampleImages(setSampleImages);

  // Create the pages object with the correct types.
  // const [pages, setPages] = useState<React.ComponentType<any>[]>([]);
  const { status } = useAppSelector((state) => state.user);
  const alert = useAlert();
  const { setActiveStep, setIsVisible } = useContext(
    StepperProgressContext
  ) as {
    setActiveStep: (value: React.SetStateAction<number>) => void;
    setIsVisible: (value: boolean) => void;
  };

  const dispatch = useAppDispatch();
  // const loadUser = async () => {
  //   try {
  //     // const userid = document.cookie
  //     //   .split(";")
  //     //   .find((cookie) => cookie.trim().startsWith("token="))
  //    // .split("=")[1];

  //     const response = await axios.get("/api/me");
  //     console.log(response);
  //     if (response.data.user) {
  //       // setPages([InventoryNorms2]);
  //       setPages([ModelConfiguration]);
  //     } else {
  //       setPages([Auth]);
  //       // setPages([UserCredentials]);
  //     }
  //     setLoading(false);
  //   } catch (err) {
  //     setPages([Auth]);
  //     // setPages([UserCredentials]);
  //     console.log(err);
  //     setLoading(false);
  //   }
  // };
  const loadUser = async () => {
    try {
      // const userid = document.cookie
      //   .split(";")
      //   .find((cookie) => cookie.trim().startsWith("token="))
      // .split("=")[1];
      // Get cookies for user_id and company_id
      const cookies = document.cookie.split("; ");
      const user_id = cookies
        .find((row) => row.startsWith("user_id="))
        ?.split("=")[1];

      if (!user_id) {
        setPages([Auth]);
        return;
      }
      setIsLoading(true);
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
  useEffect(() => {
    if (status === "unknown") {
      loadUser();
    }
    // setPages([
    //   Auth,
    // LocationMaster,
    // UserCredentials,
    // ModelConfiguration,
    // CategoryMaster,
    // PriceMaster,
    // InventoryNorms,
    // InventoryNorms2,
    // SalesPattern,
    // ShipmentNorms,
    // ModelRun,
    // ]);
  }, [status]);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <ContentWrapper>
      <Spinner isLoading={isLoading} />
      <div className="absolute inset-0 h-full w-full bg-[rgb(40,50,86)]/75 -z-10"></div>
      <Img
        src="/background-image.jpg"
        alt="Product Image"
        className="absolute -z-20 inset-0 h-full w-full object-cover"
      />

      <div
        ref={ref}
        className="h-full overflow-x-scroll overflow-y-hidden scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div
          className={`flex items-center mt-[12vh] h-[88vh]`}
          style={{ width: `${pages.length * 100}%` }}
        >
          {!isLoading ? (
            <maincontainer.Provider
              value={{ current: ref.current, pages, setPages }}
            >
              {pages.map((PageComponent, index) => (
                <PageComponent key={index} />
              ))}
            </maincontainer.Provider>
          ) : (
            <div className="flex mt-[12vh] items-center justify-center h-full w-screen bg-gray-100/25 absolute top-0 left-0 right-0 bottom-0">
              <div className="animate-spin rounded-full h-32 w-32  border-t-2 mb-64 border-b-8 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-[30vh]"></div>
    </ContentWrapper>
  );
};
export default Home;
