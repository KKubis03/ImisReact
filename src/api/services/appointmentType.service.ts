import api from "../api";

import type {
  PaginatedResponse,
  SelectListItem,
  BaseQueryParams,
} from "../types/pagination";

export interface AppointmentType {
  id: number;
  name: string;
  description: string;
}

const $URL = "/appointmentTypes";

export const AppointmentTypesService = {
  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<AppointmentType>> => {
    const response = await api.get<PaginatedResponse<AppointmentType>>($URL, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<AppointmentType> => {
    const response = await api.get<AppointmentType>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<AppointmentType, "id">
  ): Promise<AppointmentType> => {
    const response = await api.post<AppointmentType>($URL, data);
    return response.data;
  },

  update: async (
    id: number,
    data: AppointmentType
  ): Promise<AppointmentType> => {
    const response = await api.put<AppointmentType>(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },

  getSelectList: async (): Promise<SelectListItem[]> => {
    const response = await api.get<SelectListItem[]>(`${$URL}/lookup`);
    return response.data;
  },
};
