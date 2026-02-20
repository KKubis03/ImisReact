import api from "../api";
import type { SelectListItem, BaseQueryParams } from "../types/pagination";

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  pesel: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
}

export interface PatientDashboardAppointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentTypeName: string;
  patientFullName: string | null;
  doctorFullName: string;
  appointmentDate: string;
  appointmentStatusName: string;
  invoiceId: number | null;
}

export interface PatientDashboardResponse {
  pastAppoinments: PatientDashboardAppointment[];
  upcomingAppoinment: PatientDashboardAppointment | null;
  totalAppointments: number;
  cancelledAppointments: number;
  upcomingAppointments: number;
  totalSpent: string;
}

export interface PaginatedPatientsResponse {
  items: Patient[];
  totalCount: number;
  pageNr: number;
  pageSize: number;
  totalPages: number;
}

export interface PatientQueryParams extends BaseQueryParams {
  gender?: string;
}

const $URL = "/patients";

export const PatientsService = {
  getAll: async (
    params?: PatientQueryParams
  ): Promise<PaginatedPatientsResponse> => {
    const response = await api.get<PaginatedPatientsResponse>($URL, { params });
    return response.data;
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await api.get<Patient>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<Patient, "id">): Promise<Patient> => {
    const response = await api.post<Patient>($URL, data);
    return response.data;
  },

  update: async (id: number, data: Patient): Promise<Patient> => {
    const response = await api.put<Patient>(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },

  getSelectList: async (): Promise<SelectListItem[]> => {
    const response = await api.get<SelectListItem[]>(`${$URL}/lookup`);
    return response.data;
  },
};
