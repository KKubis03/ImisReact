import api from "../api";
import type { PaginatedResponse, BaseQueryParams } from "../types/pagination";

export interface Discount {
  id: number;
  name: string;
  percentage: number;
}

const $URL = "/discounts";

export const DiscountsService = {
  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<Discount>> => {
    const response = await api.get<PaginatedResponse<Discount>>($URL, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Discount> => {
    const response = await api.get<Discount>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<Discount, "id">): Promise<Discount> => {
    const response = await api.post<Discount>($URL, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },
};
