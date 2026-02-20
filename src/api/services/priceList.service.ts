import api from "../api";
import type { PaginatedResponse, BaseQueryParams } from "../types/pagination";

export interface PriceListItem {
  id: number;
  appointmentTypeId: number;
  appointmentTypeName: string;
  price: number;
}

export interface PriceListItemDto {
  price: number;
  appointmentTypeName: string;
  appointmentTypeDescription: string;
}

export interface CreatePriceListItem {
  appointmentTypeId: number;
  price: number;
}

export interface UpdatePriceListItem {
  id: number;
  appointmentTypeId: number;
  price: number;
}

const $URL = "/pricelists";

export const PriceListService = {
  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<PriceListItem>> => {
    const response = await api.get<PaginatedResponse<PriceListItem>>($URL, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<PriceListItem> => {
    const response = await api.get<PriceListItem>(`${$URL}/${id}`);
    return response.data;
  },

  getPrices: async (): Promise<PriceListItemDto[]> => {
    const response = await api.get<PriceListItemDto[]>(`${$URL}/prices`);
    return response.data;
  },

  create: async (data: CreatePriceListItem): Promise<PriceListItem> => {
    const response = await api.post<PriceListItem>($URL, data);
    return response.data;
  },

  update: async (
    id: number,
    data: UpdatePriceListItem
  ): Promise<PriceListItem> => {
    const response = await api.put<PriceListItem>(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },
};
