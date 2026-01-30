import axiosClient from "../axiosClient";

export interface Schedule {
  id: number;
  doctorId: number;
  dayOfTheWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: string;
}

export interface ScheduleListItem {
  id: number;
  doctorId: number;
  doctorName: string;
  doctorSurname: string;
  dayOfTheWeek: number;
  dayOfTheWeekLabel: string;
  startTime: string;
  endTime: string;
  slotDuration: string;
}

export const ScheduleService = {
  getAvailableSlots: (doctorId: number, date: string) =>
    axiosClient.get<string[]>(`/Schedule/available-slots?doctorId=${doctorId}&date=${date}`),

  getAll: () =>
    axiosClient.get<ScheduleListItem[]>("/Schedule"),

  getByDoctorId: (doctorId: number) =>
    axiosClient.get<ScheduleListItem[]>(`/Schedule/doctor-schedule?id=${doctorId}`),

  getById: (id: number) =>
    axiosClient.get<Schedule>(`/Schedule/${id}`),

  create: (data: Omit<Schedule, "id">) =>
    axiosClient.post("/Schedule", data),

  update: (id: number, data: Schedule) =>
    axiosClient.put(`/Schedule/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/Schedule/${id}`),
};
