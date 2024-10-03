import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addCategories,
  addLocations,
  addSalesPattern,
  addWarehouse,
} from "../userThunks";

interface ModelState {
  status?: string;
  error?: string | null;
  categories: {
    category_name: string;
    inventory_days: number;
    [key: string]: string | number;
  }[];
}
const initialLocationState: ModelState = {
  categories: [],
};
const { actions, reducer } = createSlice({
  name: "category",
  initialState: initialLocationState,
  reducers: {
    setsalesPatternStatus: (state, action) => {
      state.status = action.payload;
    },
    setsalesPattern: (state, action) => {
      state.categories = action.payload;
    },
    clearSalesPattern: () => {
      return initialLocationState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSalesPattern.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addSalesPattern.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.categories = action.payload;
        state.error = null;
        // state.isAuthenticated = true;
      })
      .addCase(addSalesPattern.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});
export const { setsalesPatternStatus, setsalesPattern, clearSalesPattern } =
  actions;
export default reducer;
