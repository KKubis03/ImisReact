import axiosClient from "../axiosClient";

export interface InvoiceStatus {
  id: number;
  statusName: string;
  description: string;
}

export const InvoiceStatusService = {
  getAll: (url?: string) =>
    axiosClient.get<InvoiceStatus[]>(url || "/InvoiceStatus"),

  getById: (id: number) =>
    axiosClient.get<InvoiceStatus>(`/InvoiceStatus/${id}`),

  create: (data: Omit<InvoiceStatus, "id">) =>
    axiosClient.post("/InvoiceStatus", data),

  update: (id: number, data: InvoiceStatus) =>
    axiosClient.put(`/InvoiceStatus/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/InvoiceStatus/${id}`),
};
