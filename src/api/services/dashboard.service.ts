import api from "../api";
import type {
  DashboardRangeResponse,
  DashboardStatsResponse,
} from "./doctors.service";
import type { PatientDashboardResponse } from "./patients.service";
import type { UserInfo } from "./user.service";

export interface ManagerStatsResponse {
  plannedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalAppointments: number;
  issuedInvoices: number;
  paidInvoices: number;
  totalInvoices: number;
  totalIncome: number;
}

export interface AdminDashboardResponse {
  users: number;
  doctors: number;
  patients: number;
  departments: number;
  usersList: UserInfo[];
  rolesList: string[];
}

export interface IncomeChartDataPoint {
  label: string;
  value: number;
}

const $URL = "/dashboards";

export const DashboardService = {
  getManagerStats: async (range: number = 0): Promise<ManagerStatsResponse> => {
    const response = await api.get<ManagerStatsResponse>(
      `${$URL}/manager-stats?range=${range}`
    );
    return response.data;
  },

  getManagerIncomeChart: async (): Promise<IncomeChartDataPoint[]> => {
    const response = await api.get<IncomeChartDataPoint[]>(
      `${$URL}/manager-income-chart`
    );
    return response.data;
  },

  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    const response = await api.get<AdminDashboardResponse>(`${$URL}/admin`);
    return response.data;
  },

  getDoctorDashboardRange: async (
    doctorId: number,
    range: 0 | 1 | 2
  ): Promise<DashboardRangeResponse> => {
    const response = await api.get<DashboardRangeResponse>(
      `${$URL}/doctor-range-stats`,
      { params: { doctorId, range } }
    );
    return response.data;
  },

  getDoctorDashboardStats: async (
    doctorId: number
  ): Promise<DashboardStatsResponse> => {
    const response = await api.get<DashboardStatsResponse>(
      `${$URL}/doctor-stats`,
      { params: { doctorId } }
    );
    return response.data;
  },

  getPatientDashboard: async (
    patientId: number
  ): Promise<PatientDashboardResponse> => {
    const response = await api.get<PatientDashboardResponse>(
      `${$URL}/patient`,
      { params: { patientId } }
    );
    return response.data;
  },
};
