import { DownloadHelper } from "../../utils/DownloadHelper";
import api from "../api";
import type { PaginatedResponse, BaseQueryParams } from "../types/pagination";

export interface InvoiceItemResponse {
  id: number;
  invoiceId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  vatRate: number;
}

export interface InvoiceDetails {
  id: number;
  sellerName: string;
  sellerAddress: string;
  sellerTaxId: string;
  sellerBankAccount: string;
  sellerBankName: string;
  buyerName: string;
  buyerAddress: string;
  buyerTaxId: string;
}

export interface Invoice {
  id: number;
  appointmentId: number | null;
  statusName: string;
  discountPercentage: number;
  discountName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  paymentDate: string | null;
  paymentMethodName: string;
  totalNet: number;
  totalVat: number;
  totalGross: number;
  totalDiscountAmount: number;
  currency: string;
  items?: InvoiceItemResponse[];
  invoiceDetails?: InvoiceDetails;
}

export interface InvoiceQueryParams extends BaseQueryParams {
  statusId?: number;
  issueDate?: string;
  dueDate?: string;
  totalGrossMin?: number;
  totalGrossMax?: number;
}

export interface CreateInvoiceDto {
  appointmentId?: number;
  discountId?: number;
  issueDate: string;
  dueDate: string;
  paymentMethodId: number;
  currency: string;
  buyerName?: string;
  buyerAddress?: string;
  buyerTaxId?: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  unit: string;
}

export interface EditInvoiceItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  unit: string;
}

export interface CreateInvoiceWithItemsDto {
  appointmentId?: number;
  issueDate: string;
  dueDate: string;
  paymentMethodId: number;
  discountId?: number;
  buyerName: string;
  buyerAddress: string;
  buyerTaxId: string;
  items: InvoiceItem[];
}

export interface UpdateInvoiceDto {
  id: number;
  issueDate: string;
  dueDate: string;
  paymentMethodId: number;
  discountId?: number;
}

const $URL = "/invoices";

export const InvoiceService = {
  getAll: async (
    params?: InvoiceQueryParams
  ): Promise<PaginatedResponse<Invoice>> => {
    const response = await api.get<PaginatedResponse<Invoice>>($URL, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Invoice> => {
    const response = await api.get<Invoice>(`${$URL}/${id}`);
    return response.data;
  },

  getIdByAppointment: async (appointmentId: number): Promise<number> => {
    const response = await api.get<number>(`${$URL}/get-id-by-appointment`, {
      params: { appointmentId },
    });
    return response.data;
  },

  create: async (
    invoice: CreateInvoiceDto | CreateInvoiceWithItemsDto
  ): Promise<any> => {
    const response = await api.post($URL, invoice);
    return response.data;
  },

  update: async (invoice: UpdateInvoiceDto): Promise<any> => {
    const response = await api.patch(`${$URL}/${invoice.id}`, invoice);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },

  updateItems: async (id: number, items: InvoiceItem[]): Promise<any> => {
    const response = await api.patch(`${$URL}/${id}/items`, items);
    return response.data;
  },

  updateBuyerInfo: async (
    id: number,
    data: { name: string; address: string; taxId?: string }
  ): Promise<any> => {
    const response = await api.patch(`${$URL}/${id}/buyer-info`, data);
    return response.data;
  },

  payInvoice: async (id: number): Promise<any> => {
    const response = await api.patch(`${$URL}/${id}/pay`);
    return response.data;
  },

  issueInvoice: async (id: number): Promise<any> => {
    const response = await api.patch(`${$URL}/${id}/issue`);
    return response.data;
  },

  downloadPdf: async (
    id: number,
    invoiceNumber: string = "invoice"
  ): Promise<void> => {
    try {
      const response = await api.get(`${$URL}/${id}/pdf`, {
        responseType: "blob",
      });
      DownloadHelper.saveBlob(response.data, `${invoiceNumber}.pdf`);
    } catch (err) {
      const errorMessage = await DownloadHelper.parseBlobError(err);
      throw new Error(errorMessage);
    }
  },
};
