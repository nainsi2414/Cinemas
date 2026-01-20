import axiosInstance from "./axiosInstance";

export async function registerUser(data) {
  const res = await axiosInstance.post("/auth/signup", data);
  return res.data;
}

export async function loginUser(data) {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
}
