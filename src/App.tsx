import { createContext, useEffect, useState } from "react";
import Home from "./pages/Home";
import webfont from "webfontloader";
import Header from "./components/Header";

export const StepperProgressContext = createContext({
  isVisible: false,
  setIsVisible: (value: boolean | ((prevState: boolean) => boolean)) => {},
  activeStep: 0,
  setActiveStep: (value: number | ((prevState: number) => number)) => {},
});
function App() {
  // const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  // useWebFontLoader();
  useWebFontLoader();
  return (
    <div className="relative">
      <StepperProgressContext.Provider
        value={{ isVisible, setIsVisible, activeStep, setActiveStep }}
      >
        <Header />
        <Home />
      </StepperProgressContext.Provider>
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/register" element={<Register />} />
      </Routes> */}
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
