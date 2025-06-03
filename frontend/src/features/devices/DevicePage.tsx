import React from "react";
import DeviceTable from "./DeviceTable";
import { useDevices } from "./useDevices";

const DevicesPage = () => {
  const { devices, isLoading, error } = useDevices();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading devices</p>;

  return (
    <div>
      <h1>Devices</h1>
      <DeviceTable devices={devices} />
    </div>
  );
};

export default DevicesPage;
