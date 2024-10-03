import { createSlice } from "@reduxjs/toolkit";
import {
  // addCategories,
  // addLocations,
  addPriceMaster,
  // addWarehouse,
} from "../userThunks";

interface ModelState {
  status?: string;
  error?: string | null;
  shipmentPrice: [];
}
const initialLocationState: ModelState = {
  shipmentPrice: [],
};
const { actions, reducer } = createSlice({
  name: "pricemaster",
  initialState: initialLocationState,
  reducers: {
    setPriceMasterStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPriceMaster.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPriceMaster.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.shipmentPrice = action.payload;
        state.error = null;
        // state.isAuthenticated = true;
      })
      .addCase(addPriceMaster.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});
export const { setPriceMasterStatus } = actions;
export default reducer;
