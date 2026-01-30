import axiosClient from "../axiosClient";

export interface Discount {
  id: number;
  name: string;
  percentage: number;
}

export const DiscountsService = {
  getAll: (url?: string) =>
    axiosClient.get<Discount[]>(url || "/discount"),

  getById: (id: number) =>
    axiosClient.get<Discount>(`/discount/${id}`),

  create: (data: Omit<Discount, "id">) =>
    axiosClient.post("/discount", data),

  delete: (id: number) =>
    axiosClient.delete(`/discount/${id}`),
};
