import axiosClient from "../axiosClient";

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specializationId: number;
  departmentId: number;
  email: string;
  phoneNumber: string;
}

export interface DoctorListItem {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specializationName: string;
  departmentName: string;
  email: string;
  phoneNumber: string;
}

export const DoctorsService = {
  getAll: (url?: string) =>
    axiosClient.get<DoctorListItem[]>(url || "/doctor"),

  getById: (id: number) =>
    axiosClient.get<Doctor>(`/doctor/${id}`),

  create: (data: Omit<Doctor, "id">) =>
    axiosClient.post("/doctor", data),

  update: (id: number, data: Doctor) =>
    axiosClient.put(`/doctor/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/doctor/${id}`),

  getSelectList: () =>
    axiosClient.get<{ id: number; fullName: string; departmentName: string }[]>("/doctor/select-list"),
};
