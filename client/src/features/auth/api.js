import { http } from "../../shared/api/http.js";

export const createEmployee = async (payload) => {
  const res = await http.post("/admin/create-employee", payload);
  return res.data;
};


export const updateEmployee = async (id, payload) => {
  const res = await http.patch(`/admin/update/${id}`, payload);
  return res.data;
};


export const deleteEmployee = async (id) => {
  const res = await http.delete(`/admin/${id}`);
  return res.data;
};


export const getAllEmployees = async () => {
  const res = await http.get("/admin");
  return res.data;
};


export const toggleEmployeeActive = async (id) => {
  const res = await http.patch(`/admin/${id}/active-status`);
  return res.data;
};
