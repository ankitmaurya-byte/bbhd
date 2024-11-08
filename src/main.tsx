import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import axios from "axios";
// axios.defaults.baseURL = "http://localhost:5000";
const queryClient = new QueryClient();
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};
axios.defaults.baseURL =
  "https://fastapi-dev-1-hneke7a2fvf0hyba.eastus-01.azurewebsites.net/";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <AlertProvider template={AlertTemplate} {...options}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </AlertProvider>
    </StrictMode>
  </Provider>
);
