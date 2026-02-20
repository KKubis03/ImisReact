import api from "../api";
import type { PaginatedResponse, BaseQueryParams } from "../types/pagination";
export interface Role {
  id: string;
  name: string;
  normalizedName: string;
  concurrencyStamp: string | null;
}
export interface RoleListItem {
  id: string;
  name: string;
}

const $URL = "/roles";
export const RolesService = {
  getRolesList: async (): Promise<RoleListItem[]> => {
    const response = await api.get<RoleListItem[]>(`${$URL}/list`);
    return response.data;
  },

  getAll: async (
    params?: BaseQueryParams
  ): Promise<PaginatedResponse<Role>> => {
    const response = await api.get<PaginatedResponse<Role>>($URL, { params });
    return response.data;
  },

  addUserToRole: async (email: string, roleName: string): Promise<void> => {
    await api.post(`${$URL}/add-to-role`, null, {
      params: { email, roleName },
    });
  },

  removeUserFromRole: async (
    email: string,
    roleName: string
  ): Promise<void> => {
    await api.post(`${$URL}/remove-from-role`, null, {
      params: { email, roleName },
    });
  },

  createRole: async (roleName: string): Promise<void> => {
    await api.post(`${$URL}/create`, null, { params: { roleName } });
  },
};
