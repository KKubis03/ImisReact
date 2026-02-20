import React from "react";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  AccountBox as AccountBoxIcon,
  Settings as SettingsIcon,
  AssignmentIndOutlined as AssignmentIndOutlinedIcon,
  EventNote as AppointmentsIcon,
  Person as ProfileIcon,
} from "@mui/icons-material";
import { PATHS } from "../routes/paths";

export interface SidebarSubItem {
  label: string;
  path: string;
  roles?: string[];
}

export interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  subItems?: SidebarSubItem[];
  roles?: string[];
}
export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: DashboardIcon,
    path: PATHS.DASHBOARD,
    roles: ["Admin", "Manager", "Doctor", "Patient"],
  },
  {
    label: "Patients",
    icon: PeopleIcon,
    path: PATHS.PATIENTS,
    roles: ["Admin", "Manager", "Receptionist"],
  },
  {
    label: "Users",
    icon: AccountBoxIcon,
    roles: ["Admin"],
    subItems: [
      { label: "All Users", path: PATHS.USERS },
      { label: "Roles", path: PATHS.ROLES },
    ],
  },
  {
    label: "Doctors",
    icon: AssignmentIndOutlinedIcon,
    roles: ["Admin", "Manager"],
    subItems: [
      { label: "All Doctors", path: PATHS.DOCTORS },
      {
        label: "Specializations",
        path: PATHS.SPECIALIZATIONS,
        roles: ["Admin"],
      },
    ],
  },
  {
    label: "Appointments",
    icon: AppointmentsIcon,
    roles: ["Admin", "Doctor", "Receptionist"],
    subItems: [
      {
        label: "All Appointments",
        path: PATHS.APPOINTMENTS,
        roles: ["Admin", "Receptionist"],
      },
      {
        label: "Appointment Statuses",
        path: PATHS.APPOINTMENT_STATUSES,
        roles: ["Admin"],
      },
      {
        label: "Appointment Types",
        path: PATHS.APPOINTMENT_TYPES,
        roles: ["Admin"],
      },
    ],
  },
  {
    label: "My Appointments",
    icon: AppointmentsIcon,
    path: PATHS.DOCTORS_MY_APPOINTMENTS,
    roles: ["Doctor"],
  },
  {
    label: "Schedule",
    icon: CalendarIcon,
    path: PATHS.DOCTORS_MY_SCHEDULE,
    roles: ["Doctor"],
  },
  {
    label: "Invoices",
    icon: DescriptionIcon,
    roles: ["Admin", "Manager", "Receptionist"],
    subItems: [
      { label: "All Invoices", path: PATHS.INVOICES },
      {
        label: "Invoice Statuses",
        path: PATHS.INVOICE_STATUSES,
        roles: ["Admin"],
      },
      {
        label: "Payment Methods",
        path: PATHS.PAYMENT_METHODS,
        roles: ["Admin"],
      },
      {
        label: "Discounts",
        path: PATHS.DISCOUNTS,
        roles: ["Admin", "Manager"],
      },
    ],
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    roles: ["Admin"],
    subItems: [
      { label: "General", path: PATHS.SETTINGS },
      { label: "Departments", path: PATHS.DEPARTMENTS },
      { label: "PriceList", path: PATHS.PRICELISTS },
      { label: "Templates", path: PATHS.DOCS_TEMPLATES },
    ],
  },
  {
    label: "My Profile",
    icon: ProfileIcon,
    path: PATHS.PROFILE,
    roles: ["Patient", "Doctor"],
  },
  {
    label: "Schedule Appointment",
    icon: CalendarIcon,
    path: "/patient/schedule",
    roles: ["Patient"],
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    roles: ["Manager"],
    subItems: [{ label: "PriceList", path: PATHS.PRICELISTS }],
  },
];
