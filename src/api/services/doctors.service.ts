import api from "../api";
import type { SelectListItem, BaseQueryParams } from "../types/pagination";

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specializationId: number;
  departmentId: number;
  specializationName?: string;
  departmentName?: string;
  email: string;
  phoneNumber: string;
}

export interface DoctorListItem {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specializationName: string;
  departmentName: string;
  email: string;
  phoneNumber: string;
}

export interface DailyStatistics {
  day: string;
  appointments: number;
  completed: number;
}

export interface MonthlyStatistics {
  month: string;
  appointments: number;
}

export interface DashboardStatsResponse {
  weeklyStats: DailyStatistics[];
  monthlyStats: MonthlyStatistics[];
}

export interface DashboardRangeResponse {
  planned: number;
  completed: number;
  remaining: number;
  patients: number;
}

export interface PaginatedDoctorsResponse {
  items: DoctorListItem[];
  totalCount: number;
  pageNr: number;
  pageSize: number;
  totalPages: number;
}

export interface DoctorQueryParams extends BaseQueryParams {
  specializationId?: number;
  departmentId?: number;
}

const $URL = "/doctors";

export const DoctorsService = {
  getAll: async (
    params?: DoctorQueryParams
  ): Promise<PaginatedDoctorsResponse> => {
    const response = await api.get<PaginatedDoctorsResponse>($URL, { params });
    return response.data;
  },

  getById: async (id: number): Promise<Doctor> => {
    const response = await api.get<Doctor>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<Doctor, "id">): Promise<Doctor> => {
    const response = await api.post<Doctor>($URL, data);
    return response.data;
  },

  update: async (id: number, data: Doctor): Promise<Doctor> => {
    const response = await api.put<Doctor>(`${$URL}/${id}`, data);
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
