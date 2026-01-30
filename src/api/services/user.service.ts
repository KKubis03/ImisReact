import axiosClient from "../axiosClient";

export interface UserInfo {
  id: string;
  email: string;
  userName: string;
  roles: string[];
  doctorId?: number;
  patientId?: number;
  fullname?: string;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  roles?: string[];
}

export interface UpdateUserDto {
  email: string;

}

/**
 * Pobiera informacje o zalogowanym użytkowniku
 */
export const getCurrentUser = async (): Promise<UserInfo> => {
  const response = await axiosClient.get<UserInfo>("/User/me");
  return response.data;
};

/**
 * Pobiera listę wszystkich użytkowników
 */
export const getAll = async (): Promise<User[]> => {
  const response = await axiosClient.get<User[]>("/User/all");
  return response.data;
};

/**
 * Pobiera użytkownika po ID
 */
export const getById = async (id: string): Promise<User> => {
  const response = await axiosClient.get<User>(`/User?id=${id}`);
  return response.data;
};

/**
 * Aktualizuje użytkownika
 */
export const update = async (
  id: string,
  email: string
): Promise<void> => {
  await axiosClient.put(`/User/${id}?newEmail=${encodeURIComponent(email)}`);
};

export default {
  getCurrentUser,
  getAll,
  getById,
  update,
};
