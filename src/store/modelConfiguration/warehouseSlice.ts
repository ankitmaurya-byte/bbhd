import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addCategories, addLocations, addWarehouse } from "../userThunks";

interface ModelState {
  status?: string;
  error?: string | null;
  warehouses: Array<{
    location: string;
    day: string;
  }>;
}
const initialLocationState: ModelState = {
  warehouses: [],
};
const { actions, reducer } = createSlice({
  name: "category",
  initialState: initialLocationState,
  reducers: {
    setWarehouses: (state, action) => {
      state.status = action.payload;
    },
    clearWarehouse: (state) => {
      return initialLocationState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addWarehouse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addWarehouse.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.warehouses = action.payload;
        state.error = null;
        // state.isAuthenticated = true;
      })
      .addCase(addWarehouse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});
export const { setWarehouses, clearWarehouse } = actions;
export default reducer;
