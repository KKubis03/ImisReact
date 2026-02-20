import api from "../api";
import type {
  PaginatedResponse,
  SelectListItem,
  BaseQueryParams,
} from "../types/pagination";

export interface AppointmentStatus {
  id: number;
  statusName: string;
  description: string;
}

const $URL = "/appointmentStatuses";

export const AppointmentStatusesService = {
  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<AppointmentStatus>> => {
    const response = await api.get<PaginatedResponse<AppointmentStatus>>($URL, {
      params,
    });
    return response.data;
  },

  getSelectList: async (): Promise<SelectListItem[]> => {
    const response = await api.get<SelectListItem[]>(`${$URL}/lookup`);
    return response.data;
  },

  getById: async (id: number): Promise<AppointmentStatus> => {
    const response = await api.get<AppointmentStatus>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<AppointmentStatus, "id">
  ): Promise<AppointmentStatus> => {
    const response = await api.post<AppointmentStatus>($URL, data);
    return response.data;
  },

  update: async (
    id: number,
    data: AppointmentStatus
  ): Promise<AppointmentStatus> => {
    const response = await api.put<AppointmentStatus>(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },
};
