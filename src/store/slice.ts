import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addOrganisationDetails, loginUser, registerUser } from "./userThunks";

// Define a type for the slice state
interface CounterState {
  user: {
    user_id: number | null;
    password: string;
    first_name: string;
    username: string;
    last_name: string;
    role: string;
    email: string;
    companyid: number | null;
  };
  status?:
    | "idle"
    | "loading"
    | "unknown"
    | "succeeded"
    | "login"
    | "register"
    | "failed";
  error?: null | string;
  isAuthenticated: boolean;
}

// Define the initial state using that type
const initialState: CounterState = {
  user: {
    user_id: null,
    password: "",
    first_name: "",
    last_name: "",
    role: "",
    username: "",
    email: "",
    companyid: null,
  },
  status: "unknown",
  isAuthenticated: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = {
        user_id: null,
        password: "",
        first_name: "",
        last_name: "",
        username: "",
        role: "",
        email: "",
        companyid: null,
      };
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    setEmailPass: (state, action) => {
      state.user.email = action.payload.email;
      state.user.password = action.payload.password;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          status: "succeeded",
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log(action);
        state.status = "failed";
        state.error =
          (action.payload as { message: string })?.message ||
          (action.error as Error).message ||
          "An error occurred";
      });
  },
});
interface UserState {
  status?: string;
  error?: null | string;

  organisationInfo: {
    address: string;
    address2: string;
    city: string;
    contact_email: string;
    contact_phone: string;
    country: string;
    name: string;
    pincode: string;
    state: string;
  };
}

const initialInfoState: UserState = {
  status: "idle",

  organisationInfo: {
    address: "",
    address2: "",
    city: "Select city",
    contact_email: "",
    contact_phone: "",
    country: "Select country",
    name: "",
    pincode: "",
    state: "Select state",
  },
};
const oranisationSlice = createSlice({
  name: "info",
  initialState: initialInfoState,
  reducers: {
    setInfoSliceStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setOrganisation: (state, action) => {
      state.organisationInfo = action.payload;
    },
    clearInfo: () => {
      return {
        organisationInfo: {
          address: "",
          address2: "",
          city: "",
          contact_email: "",
          contact_phone: "",
          country: "",
          name: "",
          pincode: "",
          state: "",
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrganisationDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOrganisationDetails.fulfilled, (state, action) => {
        state.organisationInfo = action.payload;
        state.status = "succeeded";
      })
      .addCase(addOrganisationDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setInfoSliceStatus, setOrganisation, clearInfo } =
  oranisationSlice.actions;
export const organisationReducer = oranisationSlice.reducer;
// export const { increment, decrement, incrementByAmount } = userSlice.actions;
export const { clearUser, setUser, setEmailPass } = userSlice.actions;
export const userReducer = userSlice.reducer;
