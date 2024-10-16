import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addInventoryNorms } from "../userThunks";

export interface ModelState {
  status?: string;
  error?: string | null;
  inventoryNorms: {
    normbasis: string;
    level: string;
    days: number | null;
    warehouse: string;
  };
}
const initialInventoryNormsState: ModelState = {
  inventoryNorms: {
    normbasis: "",
    level: "",
    days: null,
    warehouse: "",
  },
};
const { actions, reducer } = createSlice({
  name: "location",
  initialState: initialInventoryNormsState,
  reducers: {
    setInventoryNormsStatus: (
      state,
      action: PayloadAction<keyof ModelState>
    ) => {
      state.status = action.payload;
    },
    setInventory: (
      state,
      action: PayloadAction<{
        normbasis: string;
        level: string;
        days: number | null;
        warehouse: string;
      }>
    ) => {
      state.inventoryNorms = action.payload;
    },
    clearInventoryNorms: (state) => {
      state.inventoryNorms = {
        normbasis: "",
        level: "",
        days: null,
        warehouse: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addInventoryNorms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addInventoryNorms.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.inventoryNorms = action.payload;
        state.error = null;
        // state.isAuthenticated = true;
      })
      .addCase(addInventoryNorms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});
export const { setInventoryNormsStatus, clearInventoryNorms, setInventory } =
  actions;
export default reducer;
