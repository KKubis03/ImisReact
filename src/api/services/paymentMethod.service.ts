import api from "../api";
import type {
  PaginatedResponse,
  BaseQueryParams,
  SelectListItem,
} from "../types/pagination";

export interface PaymentMethod {
  id: number;
  methodName: string;
  description: string;
}

const $URL = "/paymentmethods";

export const PaymentMethodsService = {
  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<PaymentMethod>> => {
    const response = await api.get<PaginatedResponse<PaymentMethod>>($URL, {
      params,
    });
    return response.data;
  },

  getLookup: async (): Promise<SelectListItem[]> => {
    const response = await api.get<SelectListItem[]>(`${$URL}/lookup`);
    return response.data;
  },

  getById: async (id: number): Promise<PaymentMethod> => {
    const response = await api.get<PaymentMethod>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<PaymentMethod, "id">): Promise<PaymentMethod> => {
    const response = await api.post<PaymentMethod>($URL, data);
    return response.data;
  },

  update: async (id: number, data: PaymentMethod): Promise<PaymentMethod> => {
    const response = await api.put<PaymentMethod>(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },
};
