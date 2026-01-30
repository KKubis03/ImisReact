import axiosClient from "../axiosClient";

export interface Role {
  id: string;
  name: string;
  normalizedName: string;
  concurrencyStamp: string | null;
}

/**
 * Pobiera listę wszystkich ról
 */
export const getAllRoles = async (): Promise<Role[]> => {
  const response = await axiosClient.get<Role[]>("/Roles");
  return response.data;
};

/**
 * Dodaje rolę użytkownikowi
 */
export const addUserToRole = async (
  email: string,
  roleName: string
): Promise<void> => {
  await axiosClient.post(
    `/Roles/add-to-role?email=${encodeURIComponent(
      email
    )}&roleName=${encodeURIComponent(roleName)}`
  );
};

/**
 * Usuwa rolę użytkownikowi
 */
export const removeUserFromRole = async (
  email: string,
  roleName: string
): Promise<void> => {
  await axiosClient.post(
    `/Roles/remove-from-role?email=${encodeURIComponent(
      email
    )}&roleName=${encodeURIComponent(roleName)}`
  );
};

export default {
  getAllRoles,
  addUserToRole,
  removeUserFromRole,
};
