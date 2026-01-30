import axiosClient from "../axiosClient";

export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    pesel: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phoneNumber: string;
}

export const PatientsService = {
    getAll: (url?: string) =>
        axiosClient.get<Patient[]>(url || "/patients"),

    getById: (id: number) =>
        axiosClient.get<Patient>(`/patients/${id}`),

    create: (data: Omit<Patient, "id">) =>
        axiosClient.post("/patients", data),
    
    update: (id: number, data: Patient) =>
        axiosClient.put(`/patients/${id}`, data),

    delete: (id: number) =>
        axiosClient.delete(`/patients/${id}`),

    getSelectList: () =>
        axiosClient.get<{ id: number; fullName: string; pesel: string }[]>("/patients/select-list"),
};