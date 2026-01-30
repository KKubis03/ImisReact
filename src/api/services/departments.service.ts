import axiosClient from "../axiosClient";

export interface Department {
  id: number;
  name: string;
  description: string;
}

export const DepartmentsService = {
  getAll: (url?: string) =>
    axiosClient.get<Department[]>(url || "/department"),

  getById: (id: number) =>
    axiosClient.get<Department>(`/department/${id}`),

  create: (data: Omit<Department, "id">) =>
    axiosClient.post("/department", data),

  update: (id: number, data: Department) =>
    axiosClient.put(`/department/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/department/${id}`),

  getSelectList: () =>
    axiosClient.get<{ id: number; name: string }[]>("/department/select-list"),
};
