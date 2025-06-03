// rootReducer.ts

import { combineReducers } from "@reduxjs/toolkit";
import devicesReducer from "./features/devices/devicesSlice";
import { deviceApi } from "./services/DeviceService";

// sample reducer for devices
// This file combines all the reducers in the application
const rootReducer = combineReducers({
  devices: devicesReducer,
  [deviceApi.reducerPath]: deviceApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
