import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addShipmentNorms } from "../userThunks";

interface ModelState {
  status?: string;
  error?: string | null;
  transferbased: string;
}
const initialShipmentNormsState: ModelState = {
  transferbased: "",
};
const { actions, reducer } = createSlice({
  name: "shipment",
  initialState: initialShipmentNormsState,
  reducers: {
    setShipmentStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addShipmentNorms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addShipmentNorms.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.transferbased = action.payload;
        state.error = null;
        // state.isAuthenticated = true;
      })
      .addCase(addShipmentNorms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
      });
  },
});
export const { setShipmentStatus } = actions;
export default reducer;
