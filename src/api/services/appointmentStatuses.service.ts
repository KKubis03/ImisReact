import axiosClient from "../axiosClient";

export interface AppointmentStatus {
  id: number;
  statusName: string;
  description: string;
}

export interface AppointmentStatusSelectOption {
  id: number;
  name: string;
}

export const AppointmentStatusesService = {
  getAll: (url?: string) =>
    axiosClient.get<AppointmentStatus[]>(url || "/AppointmentStatus"),

  getSelectList: () =>
    axiosClient.get<AppointmentStatusSelectOption[]>("/AppointmentStatus/select-list"),

  getById: (id: number) =>
    axiosClient.get<AppointmentStatus>(`/AppointmentStatus/${id}`),

  create: (data: Omit<AppointmentStatus, "id">) =>
    axiosClient.post("/AppointmentStatus", data),

  update: (id: number, data: AppointmentStatus) =>
    axiosClient.put(`/AppointmentStatus/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/AppointmentStatus/${id}`),
};
