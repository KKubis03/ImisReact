import api from "../api";
import type {
  PaginatedResponse,
  SelectListItem,
  BaseQueryParams,
} from "../types/pagination";

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface DoctorDto {
  fullName: string;
  specialization: string;
}

export interface DepartmentWithDoctorsDto {
  departmentName: string;
  doctors: DoctorDto[];
}

const $URL = "/departments";

export const DepartmentsService = {
  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<Department>> => {
    const response = await api.get<PaginatedResponse<Department>>($URL, {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await api.get<Department>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<Department, "id">): Promise<Department> => {
    const response = await api.post<Department>($URL, data);
    return response.data;
  },

  update: async (id: number, data: Department): Promise<Department> => {
    const response = await api.put<Department>(`${$URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },

  getSelectList: async (): Promise<SelectListItem[]> => {
    const response = await api.get<SelectListItem[]>(`${$URL}/lookup`);
    return response.data;
  },

  getAllWithDoctors: async (): Promise<DepartmentWithDoctorsDto[]> => {
    const response = await api.get<DepartmentWithDoctorsDto[]>(
      `${$URL}/all-with-doctors`
    );
    return response.data;
  },
};
