import { useGetDevicesQuery } from "./DeviceService";

export const useDevices = () => {
  const { data, error, isLoading } = useGetDevicesQuery();
  return {
    devices: data || [],
    error,
    isLoading,
  };
};
