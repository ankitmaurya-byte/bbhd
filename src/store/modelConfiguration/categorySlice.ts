import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addCategories, addLocations } from "../userThunks";

interface ModelState {
  status?: string;
  error?: string | null;
  categories: { category_name: string; [key: string]: string }[];
}
const initialLocationState: ModelState = {
  categories: [],
};
const { actions, reducer } = createSlice({
  name: "category",
  initialState: initialLocationState,
  reducers: {
    setCategoryStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setCategories: (
      state,
      action: PayloadAction<{ category_name: string; [key: string]: string }[]>
    ) => {
      state.categories = action.payload;
    },
    clearCategories: () => {
      return {
        categories: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.categories = action.payload;
        state.error = null;
        // state.isAuthenticated = true;
      })
      .addCase(addCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});
export const { setCategories, clearCategories, setCategoryStatus } = actions;
export default reducer;
