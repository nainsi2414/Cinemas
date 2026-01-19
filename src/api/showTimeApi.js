import axiosInstance from "./axiosInstance";

export const getShowTimesByDate = async (movieId, date) => {
  const res = await axiosInstance.get(
    `/show-times/${movieId}/by-date`,
    { params: { date } }, 
    {
    headers: {
    Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hcEBleGFtcGxlLmNvbSIsImlkIjoiMzEzODEwNDktYjBiZC00ZThkLWE4MDMtZTZjNGJlNWMxZGQxIiwiaWF0IjoxNzY4Mjk3Mjg3LCJleHAiOjE3Njg5MDIwODd9.GCuyIyEq0_1mf8S6lpWro_CKVn1gf3bbPanpF7bFRck" // change this
  },
  }
  );
  return res.data;
};