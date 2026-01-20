import axiosInstance from "./axiosInstance";

export const getAllMovies = async () => {
  const response = await axiosInstance.get("/movies");
  return response.data;
};

export const getMovieById = async (movieId) => {
  const res = await axiosInstance.get(`/movies/${movieId}`);
  return res.data;
}