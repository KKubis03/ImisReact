import api from "../api";
import type { PaginatedResponse, BaseQueryParams } from "../types/pagination";

export interface InvoiceStatus {
  id: number;
  statusName: string;
  description: string;
}

const $URL = "/invoicestatuses";

export const InvoiceStatusesService = {
  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<InvoiceStatus>> => {
    const response = await api.get<PaginatedResponse<InvoiceStatus>>($URL, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<InvoiceStatus> => {
    const response = await api.get<InvoiceStatus>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<InvoiceStatus, "id">): Promise<InvoiceStatus> => {
    const response = await api.post<InvoiceStatus>($URL, data);
    return response.data;
  },

  update: async (id: number, data: InvoiceStatus): Promise<InvoiceStatus> => {
    const response = await api.put<InvoiceStatus>(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },
};
