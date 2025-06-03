import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Device {
  id: string;
  os: string;
  carrierId: string;
  userId: string;
  registered: boolean;
}

interface DevicesState {
  items: Device[];
}

const initialState: DevicesState = {
  items: [],
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setDevices(state, action: PayloadAction<Device[]>) {
      state.items = action.payload;
    },
  },
});

export const { setDevices } = devicesSlice.actions;
export default devicesSlice.reducer;
