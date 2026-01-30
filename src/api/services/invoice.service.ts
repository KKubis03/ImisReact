import axiosClient from "../axiosClient";

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

export interface CreateInvoiceDto {
  appointmentId?: number;
  discountId?: number;
  issueDate: string;
  dueDate: string;
  paymentMethodId: number;
  currency: string;
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
  issueDate: string;
  dueDate: string;
  paymentMethodId: number;
  currency: string;
  buyerName: string;
  buyerAddress: string;
  buyerTaxId?: string;
  items: InvoiceItem[];
}

export interface UpdateInvoiceDto {
  id: number;
  issueDate: string;
  dueDate: string;
  paymentMethodId: number;
}

/**
 * Pobiera listę wszystkich faktur
 */
export const getAll = async () => {
  const response = await axiosClient.get<Invoice[]>("/Invoice");
  return { data: response.data };
};

/**
 * Pobiera fakturę po ID
 */
export const getById = async (id: number) => {
  const response = await axiosClient.get<Invoice>(`/Invoice/${id}`);
  return { data: response.data };
};

/**
 * Pobiera ID faktury po ID wizyty
 */
export const getIdByAppointment = async (appointmentId: number) => {
  const response = await axiosClient.get<number>(
    `/Invoice/get-id-by-appointment?appointmentId=${appointmentId}`
  );
  return { data: response.data };
};

/**
 * Tworzy nową fakturę
 */
export const create = async (invoice: CreateInvoiceDto | CreateInvoiceWithItemsDto) => {
  const response = await axiosClient.post("/Invoice", invoice);
  return { data: response.data };
};

/**
 * Tworzy nową fakturę na podstawie wizyty
 */
export const createFromAppointment = async (invoice: CreateInvoiceDto) => {
  const response = await axiosClient.post("/Invoice/create-by-appointment", invoice);
  return { data: response.data };
};

/**
 * Aktualizuje fakturę
 */
export const update = async (invoice: UpdateInvoiceDto) => {
  const response = await axiosClient.put(`/Invoice/${invoice.id}`, invoice);
  return { data: response.data };
};

/**
 * Usuwa fakturę
 */
export const deleteInvoice = async (id: number) => {
  await axiosClient.delete(`/Invoice/${id}`);
};

/**
 * Aktualizuje pozycje faktury
 */
export const updateItems = async (id: number, items: InvoiceItem[]) => {
  const response = await axiosClient.put(`/Invoice/${id}/items`, items);
  return { data: response.data };
};

/**
 * Aktualizuje informacje o nabywcy faktury
 */
export const updateBuyerInfo = async (
  id: number,
  data: { name: string; address: string; taxId?: string },
) => {
  const response = await axiosClient.put(`/Invoice/${id}/buyer-info`, data);
  return { data: response.data };
};

/**
 * Oznacza fakturę jako opłaconą
 */
export const payInvoice = async (id: number) => {
  const response = await axiosClient.patch(`/Invoice/${id}/pay`);
  return { data: response.data };
};

export default {
  getAll,
  getById,
  getIdByAppointment,
  create,
  createFromAppointment,
  update,
  updateItems,
  updateBuyerInfo,
  payInvoice,
  delete: deleteInvoice,
};
