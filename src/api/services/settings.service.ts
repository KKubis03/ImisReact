import axiosClient from "../axiosClient";

export interface Setting {
  id: number;
  settingKey: string;
  settingValue: string;
  description: string;
}

export const SettingsService = {
  getAll: (url?: string) =>
    axiosClient.get<Setting[]>(url || "/Settings"),

  getById: (id: number) =>
    axiosClient.get<Setting>(`/Settings/${id}`),

  create: (data: Omit<Setting, "id">) =>
    axiosClient.post("/Settings", data),

  update: (id: number, data: Setting) =>
    axiosClient.put(`/Settings/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/Settings/${id}`),
};
