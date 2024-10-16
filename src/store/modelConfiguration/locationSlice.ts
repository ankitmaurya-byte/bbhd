import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addLocations } from "../userThunks";

export interface ModelState {
  status?: string;
  error?: string;
  locations: {
    location: string;
    latitude: number;
    longitude: number;
  }[];
}

const initialLocationState: ModelState = {
  locations: [],
};
const { actions, reducer } = createSlice({
  name: "location",
  initialState: initialLocationState,
  reducers: {
    setLocationStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setReduxLocations: (state, action) => {
      state.locations = action.payload;
    },
    clearLocation: () => {
      return {
        locations: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addLocations.fulfilled, (state, action) => {
        return {
          status: "succeeded",
          locations: action.payload,
        };
      })
      .addCase(addLocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});
export const { setReduxLocations, clearLocation, setLocationStatus } = actions;
export default reducer;
