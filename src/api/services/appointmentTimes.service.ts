import api from "../api";

export interface AppointmentTime {
  value: string;
  label: string;
}

const formatDateForApi = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
};

const $URL = "/schedules/available-slots";

export const AppointmentTimesService = {
  getAvailableSlots: async (
    doctorId: number,
    date: string
  ): Promise<string[]> => {
    const formattedDate = formatDateForApi(date);
    const response = await api.get<string[]>($URL, {
      params: { doctorId, date: formattedDate },
    });
    return response.data;
  },
};
