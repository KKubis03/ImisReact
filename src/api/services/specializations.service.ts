import api from "../api";
import type {
  PaginatedResponse,
  SelectListItem,
  BaseQueryParams,
} from "../types/pagination";

export interface Specialization {
  id: number;
  name: string;
  description: string;
}

const $URL = "/specializations";

export const SpecializationsService = {
  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<Specialization>> => {
    const response = await api.get<PaginatedResponse<Specialization>>($URL, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Specialization> => {
    const response = await api.get<Specialization>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<Specialization, "id">): Promise<Specialization> => {
    const response = await api.post<Specialization>($URL, data);
    return response.data;
  },

  update: async (id: number, data: Specialization): Promise<Specialization> => {
    const response = await api.put<Specialization>(`${$URL}/${id}`, data);
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
