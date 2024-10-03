import { configureStore } from "@reduxjs/toolkit";
import { userReducer, organisationReducer } from "./slice";
import modelReducer from "./modelConfiguration/modelSlice";
import locationReducer from "./modelConfiguration/locationSlice";
import categoryReducer from "./modelConfiguration/categorySlice";
import inventoryNormsReducrers from "./modelConfiguration/inventoryNorms";
import shipmentNormsReducrers from "./modelConfiguration/shipmentNorms";
import warehouseReducers from "./modelConfiguration/warehouseSlice";
import salespatternReducers from "./modelConfiguration/salesPatternSlice";
import priceMasterReducers from "./modelConfiguration/priceMaster";
import { combineReducers } from "@reduxjs/toolkit";

const modelConfigurationReducer = combineReducers({
  LocationMaster: locationReducer,
  CategoryMaster: categoryReducer,
  InventoryNorms: inventoryNormsReducrers,
  ShipmentNorms: shipmentNormsReducrers,
  warehouses: warehouseReducers,
  SalesPattern: salespatternReducers,
  PriceMaster: priceMasterReducers,
  // inventoryNorem: {
  //  norms1

  //  InventoryNorms2
  //  salsepattern
  // }
  // shipmentnorm
});

const rootReducer = combineReducers({
  user: userReducer,
  organisation: organisationReducer,
  modelConfigProcess: modelReducer,
  modelConfiguration: modelConfigurationReducer,
});

const store = configureStore({
  reducer: rootReducer,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
