import axiosClient from "../axiosClient";

export interface AppointmentTime {
  value: string;
  label: string;
}

// Helper function to convert date from yyyy-MM-dd to dd.MM.yyyy format
const formatDateForApi = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

export const AppointmentTimesService = {
  getAvailableSlots: (doctorId: number, date: string) => {
    const formattedDate = formatDateForApi(date);
    return axiosClient.get<string[]>("/Schedule/available-slots", {
      params: { doctorId, date: formattedDate },
    });
  },
};
