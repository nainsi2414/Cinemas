import axiosInstance from "./axiosInstance";

export const getShowTimesByDate = async (movieId, date) => {
  const res = await axiosInstance.get(
    `/show-times/${movieId}/by-date`,
    { params: { date } }
  );
  return res.data;
};