import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ModelState {
  location: boolean;
  CategoryMaster: boolean;
  pricemaster: boolean;
  InventoryNorms: boolean;
  ShipmentNorm: boolean;
}

const initialModelState: ModelState = {
  location: false,
  CategoryMaster: false,
  pricemaster: false,
  InventoryNorms: false,
  ShipmentNorm: false,
};
const { actions, reducer } = createSlice({
  name: "modelConfProgress",
  initialState: initialModelState,
  reducers: {
    setModelProgress: (state, action: PayloadAction<keyof ModelState>) => {
      state[action.payload] = true;
    },
    clearModelProcess: () => {
      return {
        location: false,
        CategoryMaster: false,
        pricemaster: false,
        InventoryNorms: false,
        ShipmentNorm: false,
      };
    },
  },
});

export const { setModelProgress, clearModelProcess } = actions;
export default reducer;
