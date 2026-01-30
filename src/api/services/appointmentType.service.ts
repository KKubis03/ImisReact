import axiosClient from "../axiosClient";

export interface AppointmentType {
  id: number;
  name: string;
  description: string;
}

export const AppointmentTypeService = {
  getAll: (url?: string) =>
    axiosClient.get<AppointmentType[]>(url || "/AppointmentType"),

  getById: (id: number) =>
    axiosClient.get<AppointmentType>(`/AppointmentType/${id}`),

  create: (data: Omit<AppointmentType, "id">) =>
    axiosClient.post("/AppointmentType", data),

  update: (id: number, data: AppointmentType) =>
    axiosClient.put(`/AppointmentType/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/AppointmentType/${id}`),
};
