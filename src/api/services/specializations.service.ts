import axiosClient from "../axiosClient";

export interface Specialization {
  id: number;
  name: string;
  description: string;
}

export const SpecializationsService = {
  getAll: (url?: string) =>
    axiosClient.get<Specialization[]>(url || "/specialization"),

  getById: (id: number) =>
    axiosClient.get<Specialization>(`/specialization/${id}`),

  create: (data: Omit<Specialization, "id">) =>
    axiosClient.post("/specialization", data),

  update: (id: number, data: Specialization) =>
    axiosClient.put(`/specialization/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/specialization/${id}`),

  getSelectList: () =>
    axiosClient.get<{ id: number; name: string }[]>("/specialization/select-list"),
};
