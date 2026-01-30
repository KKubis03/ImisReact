import axiosClient from "../axiosClient";

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentStatusId: number;
  appointmentTypeId: number;
  appointmentTypeName: string;
  patientName: string;
  patientSurname: string;
  doctorName: string;
  doctorSurname: string;
  appointmentDate: string;
  appointmentStatusName: string;
  invoiceId: number | null;
  hasDetails: boolean;
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

export const AppointmentsService = {
  getAll: () =>
    axiosClient.get<Appointment[]>("/appointment"),

  getAllByDoctorId: (doctorId: number, date?: string) => {
    const url = date 
      ? `/appointment/Get-by-doctorId?id=${doctorId}&date=${date}`
      : `/appointment/Get-by-doctorId?id=${doctorId}`;
    return axiosClient.get<Appointment[]>(url);
  },

  getById: (id: number) =>
    axiosClient.get<Appointment>(`/appointment/${id}`),

  create: (data: AppointmentCreateData) =>
    axiosClient.post("/appointment", data),

  update: (id: number, data: AppointmentUpdateData) =>
    axiosClient.put(`/appointment/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/appointment/${id}`),

  complete: (appointmentId: number) =>
    axiosClient.post(`/appointment/complete?appointmentId=${appointmentId}`),

  getUnprocessed: (doctorId: number) =>
    axiosClient.get<UnprocessedAppointmentsResponse>(`/appointment/unprocessed?doctorId=${doctorId}`),
};
