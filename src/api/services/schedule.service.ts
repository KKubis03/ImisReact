import api from "../api";
import type { PaginatedResponse, BaseQueryParams } from "../types/pagination";

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

const $URL = "/schedules";

export const ScheduleService = {
  getAvailableSlots: async (
    doctorId: number,
    date: string
  ): Promise<string[]> => {
    const response = await api.get<string[]>(`${$URL}/available-slots`, {
      params: { doctorId, date },
    });
    return response.data;
  },

  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<ScheduleListItem>> => {
    const response = await api.get<PaginatedResponse<ScheduleListItem>>($URL, {
      params,
    });
    return response.data;
  },

  getByDoctorId: async (doctorId: number): Promise<ScheduleListItem[]> => {
    const response = await api.get<ScheduleListItem[]>(
      `${$URL}/doctor-schedule`,
      { params: { id: doctorId } }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Schedule> => {
    const response = await api.get<Schedule>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<Schedule, "id">): Promise<Schedule> => {
    const response = await api.post<Schedule>($URL, data);
    return response.data;
  },

  update: async (id: number, data: Schedule): Promise<Schedule> => {
    const response = await api.put<Schedule>(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },
};
