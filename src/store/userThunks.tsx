import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding leading zero if needed
  const day = String(date.getDate()).padStart(2, "0"); // Adding leading zero if needed
  return `${year}-${month}-${day}`;
};
export const registerUser = createAsyncThunk(
  "user/register",
  async (
    userInfo: {
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      company_id?: string;
      role: string;
    },
    thunkAPI
  ) => {
    // Ensure passwords match
    // if (password !== confirmPassword) {
    //   return thunkAPI.rejectWithValue("Passwords do not match");
    // }
    // const config: AxiosRequestConfig = {
    //   withCredentials: true,
    // };
    try {
      const date = getFormattedDate();
      const response = await axios.post("/api/users/", {
        ...userInfo,
        created_at: date,
        updated_at: date,
      });
      console.log(response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);
export const loginUser = createAsyncThunk(
  "user/login",
  async (data: FormData, thunkAPI) => {
    const email = data.get("email");
    const password = data.get("password");
    try {
      // const config: AxiosRequestConfig = {
      //   withCredentials: true,
      // };
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/me");
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const addOrganisationDetails = createAsyncThunk(
  "user/addOrganisation",
  async (
    organisationInfo: {
      name: string;
      contact_email: string;
      address: string;
      address2: string;
      pincode: string;
      contact_phone: string;
      country: string;
      state: string;
      city: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        "/api/companies/",

        { ...organisationInfo, registration_date: getFormattedDate() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // await axios.post(
      //   "/api/addModelProcess",
      //   {
      //     location: false,
      //     CategoryMaster: false,
      //     pricemaster: false,
      //     InventoryNorms: false,
      //     ShipmentNorm: false,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);
export const addLocations = createAsyncThunk(
  "config/addLocations",
  async (
    locations: {
      locations: string[];
      latitudes: number[];
      longitudes: number[];
    },
    thunkAPI
  ) => {
    try {
      const user_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_id="))
          ?.split("=")[1]
      );
      const company_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("company_id="))
          ?.split("=")[1]
      );
      const response = await axios.post("/api/location_config/", {
        ...locations,
        user_id,
        company_id,
      });

      // const response = await axios.get(
      //   "https://fastapi-dev-1-hneke7a2fvf0hyba.eastus-01.azurewebsites.net/api/companies/4"
      // );
      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);
export const addCategories = createAsyncThunk(
  "config/addcategories",
  async (categories: { name: string }[], thunkAPI) => {
    try {
      const response = await axios.post("/api/addcategories", categories, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);
export const addInventoryNorms = createAsyncThunk(
  "config/InventoryNorms",
  async (
    inventoryNorms: {
      normbasis: string;
      level: string;
      days: string;
      warehouse: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        "/api/addinventorynorms",
        inventoryNorms,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);

export const addWarehouse = createAsyncThunk(
  "config/addWarehouse",
  async (
    wareHouseData: {
      warehouse_names: string[];
      inventory_days: number[];
    },
    thunkAPI
  ) => {
    try {
      const user_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_id="))
          ?.split("=")[1]
      );
      const company_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("company_id="))
          ?.split("=")[1]
      );
      const response = await axios.post(
        "/api/warehouse_config/",
        { ...wareHouseData, user_id, company_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);
export const addSalesPattern = createAsyncThunk(
  "config/addSalesPattern",
  async (
    salesPatternData: {
      category_names: string[];
      inventory_days: number[] | null;
    },
    thunkAPI
  ) => {
    try {
      const user_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_id="))
          ?.split("=")[1]
      );
      const company_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("company_id="))
          ?.split("=")[1]
      );
      const response = await axios.post(
        "/api/category_config/",
        { ...salesPatternData, user_id, company_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);
export const addShipmentNorms = createAsyncThunk(
  "config/ShipmentNorms",
  async (
    shipmentNorms: {
      normbasis: string;
      level: string;
      transportation_type: string;
      UOM: string;
    },
    thunkAPI
  ) => {
    try {
      const user_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("user_id="))
          ?.split("=")[1]
      );
      const company_id = Number(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("company_id="))
          ?.split("=")[1]
      );
      const response = await axios.post(
        "/api/master_config",
        { ...shipmentNorms, user_id, company_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      return response.data.transportation_type;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);
export const addPriceMaster = createAsyncThunk(
  "config/PriceMaster",
  async (priceMaster: Array<{ [key: string]: string | number }>, thunkAPI) => {
    try {
      const response = await axios.post("/api/addpricemaster", priceMaster, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);
export const addModelProcess = createAsyncThunk(
  "config/PriceMaster",
  async (
    modelProcess: {
      location?: boolean;
      CategoryMaster?: boolean;
      pricemaster?: boolean;
      InventoryNorms?: boolean;
      ShipmentNorm?: boolean;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        "/api/updateModelProcess",
        modelProcess,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(
          error.message || "An unexpected error occurred"
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  }
);
