import axiosClient from "../axiosClient";

export interface AppointmentDetails {
  id: number;
  appointmentId: number;
  notes: string | null;
  diagnosis: string | null;
  recommendations: string | null;
}

export const AppointmentDetailsService = {
  getByAppointmentId: (appointmentId: number) =>
    axiosClient.get<AppointmentDetails>(`/AppointmentDetails/by-appointment/${appointmentId}`),

  create: (data: Omit<AppointmentDetails, "id">) =>
    axiosClient.post<AppointmentDetails>("/AppointmentDetails", data),

  update: (id: number, data: AppointmentDetails) =>
    axiosClient.put<AppointmentDetails>(`/AppointmentDetails/${id}`, data),
};
