import api from "../api";

export interface AppointmentDetails {
  id: number;
  appointmentId: number;
  notes: string | null;
  diagnosis: string | null;
  recommendations: string | null;
}

const $URL = "/appointmentDetails";

export const AppointmentDetailsService = {
  getByAppointmentId: async (
    appointmentId: number
  ): Promise<AppointmentDetails> => {
    const response = await api.get<AppointmentDetails>(
      `${$URL}/by-appointment/${appointmentId}`
    );
    return response.data;
  },

  create: async (
    data: Omit<AppointmentDetails, "id">
  ): Promise<AppointmentDetails> => {
    const response = await api.post<AppointmentDetails>($URL, data);
    return response.data;
  },

  update: async (
    id: number,
    data: AppointmentDetails
  ): Promise<AppointmentDetails> => {
    const response = await api.put<AppointmentDetails>(`${$URL}/${id}`, data);
    return response.data;
  },
};
