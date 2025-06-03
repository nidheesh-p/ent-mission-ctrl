// store.ts

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { deviceApi } from "./features/devices/DeviceService"; // RTK Query API
import devicesReducer from "./features/devices/devicesSlice";

const store = configureStore({
  reducer: {
    // Slices
    devices: devicesReducer,

    // RTK Query APIs
    [deviceApi.reducerPath]: deviceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(deviceApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
