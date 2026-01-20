import axiosInstance from "./axiosInstance";

export const getAllTheaters = async () => {
  const response = await axiosInstance.get("/theaters");
  return response.data;
};

export const getTheaterById = async (theaterId) => {
  const res = await axiosInstance.get(`/theaters/${theaterId}`);
  return res.data;
}
