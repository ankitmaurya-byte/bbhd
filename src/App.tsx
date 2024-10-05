import { createContext, useEffect, useState } from "react";
import Home from "./pages/Home";
import webfont from "webfontloader";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import PrepareModel from "./pages/prepareModel/PrepareModel";
import RunModel from "./pages/prepareModel/RunModel";
import ViewsOption from "./pages/prepareModel/ViewsOption";
export const StepperProgressContext = createContext({
  isVisible: false,
  setIsVisible: (value: boolean | ((prevState: boolean) => boolean)) => {},
  activeStep: 0,
  setActiveStep: (value: number | ((prevState: number) => number)) => {},
});
function App() {
  // const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [pages, setPages] = useState<React.FC[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  // useWebFontLoader();
  useWebFontLoader();
  return (
    <div className="relative">
      <StepperProgressContext.Provider
        value={{ isVisible, setIsVisible, activeStep, setActiveStep }}
      >
        <Header setPages={setPages} pages={pages} />
        <Routes>
          <Route
            path="/"
            element={<Home setPages={setPages} pages={pages} />}
          />
          <Route path="/user" element={<PrepareModel />} />
          <Route path="/runmodel" element={<RunModel />} />
          <Route path="/chart" element={<ViewsOption />} />
        </Routes>
      </StepperProgressContext.Provider>
      {/* <Footer /> */}
    </div>
  );
}

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

export default App;
