import api from "../api";
import type { PaginatedResponse, BaseQueryParams } from "../types/pagination";

export interface Setting {
  id: number;
  settingKey: string;
  settingValue: string;
  description: string;
}

const $URL = "/settings";

export const SettingsService = {
  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<Setting>> => {
    const response = await api.get<PaginatedResponse<Setting>>($URL, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Setting> => {
    const response = await api.get<Setting>(`${$URL}/${id}`);
    return response.data;
  },

  getValue: async (key: string): Promise<string> => {
    const response = await api.get<string>(`${$URL}/value/${key}`);
    return response.data;
  },

  create: async (data: Omit<Setting, "id">): Promise<Setting> => {
    const response = await api.post<Setting>($URL, data);
    return response.data;
  },

  update: async (id: number, data: Setting): Promise<Setting> => {
    const response = await api.put<Setting>(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },
};
