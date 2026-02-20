import api from "../api";
import type { PaginatedResponse } from "../types/pagination";

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  fullName: string;
  roles: string[];
  doctorId?: number;
  patientId?: number;
}

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface UserQueryParams {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface NewUserByEmailDto {
  email: string;
}

const $URL = "/users";

export const UsersService = {
  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>(`${$URL}/me`);
    return response.data;
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await api.post(`${$URL}/change-password`, data);
  },

  getAll: async (
    params?: UserQueryParams
  ): Promise<PaginatedResponse<UserSummary>> => {
    const response = await api.get<PaginatedResponse<UserSummary>>(
      `${$URL}/all`,
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<UserSummary> => {
    const response = await api.get<UserSummary>(`${$URL}`, { params: { id } });
    return response.data;
  },

  updateEmail: async (id: string, newEmail: string): Promise<void> => {
    await api.put(`${$URL}/${id}`, null, { params: { newEmail } });
  },

  create: async (userData: NewUserByEmailDto): Promise<UserInfo> => {
    const response = await api.post<UserInfo>($URL, userData);
    return response.data;
  },
};
