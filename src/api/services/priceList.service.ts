import axiosClient from "../axiosClient";

export interface PriceListItem {
  id: number;
  appointmentTypeId: number;
  appointmentTypeName: string;
  price: number;
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

export const PriceListService = {
  getAll: (url?: string) =>
    axiosClient.get<PriceListItem[]>(url || "/PriceList"),

  getById: (id: number) =>
    axiosClient.get<PriceListItem>(`/PriceList/${id}`),

  create: (data: CreatePriceListItem) =>
    axiosClient.post("/PriceList", data),

  update: (id: number, data: UpdatePriceListItem) =>
    axiosClient.put(`/PriceList/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/PriceList/${id}`),
};
