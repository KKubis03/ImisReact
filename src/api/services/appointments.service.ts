import { DownloadHelper } from "../../utils/DownloadHelper";
import api from "../api";
import type { PaginatedResponse, BaseQueryParams } from "../types/pagination";
import type { Doctor } from "./doctors.service";
import type { Patient } from "./patients.service";

export interface Appointment {
  id: number;
  patient?: Patient;
  doctor?: Doctor;
  appointmentTypeId?: number;
  appointmentStatusId?: number;
  appointmentTypeName: string;
  appointmentDate: string;
  appointmentStatusName: string;
  invoiceId: number | null;
}

export interface AppointmentListItem {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentTypeName: string;
  patientFullName: string;
  doctorFullName: string;
  appointmentDate: string;
  appointmentStatusName: string;
  invoiceId: number | null;
}

export interface AppointmentQueryParams extends BaseQueryParams {
  statusId?: number;
  typeId?: number;
  date?: string;
  patientId?: number;
}

export interface AppointmentCreateData {
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTypeId: number;
}

export interface AppointmentUpdateData {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentStatusId: number;
  appointmentTypeId: number;
  appointmentDate: string;
}

export interface UnprocessedAppointmentsResponse {
  numberOfUnprocessedAppointments: number;
  unprocessedAppointments: Appointment[];
}

export interface PatientDetails {
  id: number;
  firstName: string;
  lastName: string;
  pesel: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
}

export interface DoctorDetails {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specializationId: number;
  departmentId: number;
  specializationName: string;
  departmentName: string;
  phoneNumber: string;
  email: string;
}

export interface AppointmentDetailsData {
  id: number;
  appointmentId: number;
  notes: string | null;
  diagnosis: string | null;
  recommendations: string | null;
}

export interface AppointmentWithDetails {
  id: number;
  appointmentTypeId: number;
  appointmentDate: string;
  appointmentTypeName: string;
  appointmentStatusName: string;
  unitPrice: number;
  invoiceId: number | null;
  patient: PatientDetails;
  doctor: DoctorDetails;
  details: AppointmentDetailsData | null;
}

const $URL = "/appointments";

export const AppointmentsService = {
  getAll: async (
    params?: AppointmentQueryParams
  ): Promise<PaginatedResponse<AppointmentListItem>> => {
    const response = await api.get<PaginatedResponse<AppointmentListItem>>(
      $URL,
      {
        params: {
          ...params,
          PatientId: params?.patientId,
        },
      }
    );
    return response.data;
  },

  getAllByDoctorId: async (
    doctorId: number,
    date?: string
  ): Promise<AppointmentListItem[]> => {
    const response = await api.get<AppointmentListItem[]>(
      `${$URL}/get-by-doctorId`,
      {
        params: { doctorId: doctorId, date },
      }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Appointment> => {
    const response = await api.get<Appointment>(`${$URL}/${id}`);
    return response.data;
  },

  getWithDetails: async (id: number): Promise<AppointmentWithDetails> => {
    const response = await api.get<AppointmentWithDetails>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: AppointmentCreateData): Promise<any> => {
    const response = await api.post($URL, data);
    return response.data;
  },

  update: async (id: number, data: AppointmentUpdateData): Promise<any> => {
    const response = await api.put(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },

  complete: async (appointmentId: number): Promise<any> => {
    const response = await api.patch(`${$URL}/${appointmentId}/complete`);
    return response.data;
  },

  cancel: async (appointmentId: number): Promise<any> => {
    const response = await api.patch(`${$URL}/${appointmentId}/cancel`);
    return response.data;
  },

  getUnprocessed: async (
    doctorId: number
  ): Promise<UnprocessedAppointmentsResponse> => {
    const response = await api.get<UnprocessedAppointmentsResponse>(
      `${$URL}/unprocessed`,
      {
        params: { doctorId },
      }
    );
    return response.data;
  },

  downloadPdf: async (
    id: number,
    appointmentNumber: string = "appointment"
  ): Promise<void> => {
    try {
      const response = await api.get(`${$URL}/${id}/pdf`, {
        responseType: "blob",
      });
      DownloadHelper.saveBlob(response.data, `${appointmentNumber}.pdf`);
    } catch (err) {
      const errorMessage = await DownloadHelper.parseBlobError(err);
      throw new Error(errorMessage);
    }
  },
};
