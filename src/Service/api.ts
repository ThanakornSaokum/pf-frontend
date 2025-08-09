import axios from "axios";

const API_URL = "/api"; // เปลี่ยนตาม backend

export const api = axios.create({
  baseURL: API_URL,
});

// ดึง token จาก localStorage ใส่ header อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
