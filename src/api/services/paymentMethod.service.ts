import axiosClient from "../axiosClient";

export interface PaymentMethod {
  id: number;
  methodName: string;
  description: string;
}

export const PaymentMethodService = {
  getAll: (url?: string) =>
    axiosClient.get<PaymentMethod[]>(url || "/PaymentMethod"),

  getById: (id: number) =>
    axiosClient.get<PaymentMethod>(`/PaymentMethod/${id}`),

  create: (data: Omit<PaymentMethod, "id">) =>
    axiosClient.post("/PaymentMethod", data),

  update: (id: number, data: PaymentMethod) =>
    axiosClient.put(`/PaymentMethod/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/PaymentMethod/${id}`),
};
