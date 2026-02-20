import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { RoleBasedRoute } from "./components/routing/RoleBasedRoute.tsx";
import Layout from "./components/layout/Layout.tsx";
import RoleBasedLayout from "./components/layout/RoleBasedLayout.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.tsx";
import "./index.css";
import PatientsPage from "./pages/Patient/PatientsPage.tsx";
import PatientAddPage from "./pages/Patient/PatientAddPage.tsx";
import PatientEditPage from "./pages/Patient/PatientEditPage.tsx";
import PatientProfilePage from "./pages/Patient/PatientProfilePage.tsx";
import DepartmentsPage from "./pages/Department/DepartmentsPage.tsx";
import DepartmentFormPage from "./pages/Department/DepartmentFormPage.tsx";
import DiscountPage from "./pages/Discount/DiscountPage.tsx";
import DiscountAddPage from "./pages/Discount/DiscountAddPage.tsx";
import SpecializationPage from "./pages/Specialization/SpecializationPage.tsx";
import SpecializationFormPage from "./pages/Specialization/SpecializationFormPage.tsx";
import AppointmentStatusesPage from "./pages/AppointmentStatus/AppointmentStatusesPage.tsx";
import AppointmentStatusFormPage from "./pages/AppointmentStatus/AppointmentStatusFormPage.tsx";
import RolesPage from "./pages/Role/RolesPage.tsx";
import RoleAddPage from "./pages/Role/RoleAddPage.tsx";
import AppointmentTypesPage from "./pages/AppointmentType/AppointmentTypesPage.tsx";
import AppointmentTypeFormPage from "./pages/AppointmentType/AppointmentTypeFormPage.tsx";
import AppointmentsPage from "./pages/Appointment/AppointmentsPage.tsx";
import AppointmentDetailsPage from "./pages/Appointment/AppointmentDetailsPage.tsx";
import DoctorsPage from "./pages/Doctor/DoctorsPage.tsx";
import DoctorFormPage from "./pages/Doctor/DoctorFormPage.tsx";
import DoctorProfilePage from "./pages/Doctor/DoctorProfilePage.tsx";
import DoctorSchedulePage from "./pages/Doctor/DoctorSchedulePage.tsx";
import DoctorScheduleFormPage from "./pages/Doctor/DoctorScheduleFormPage.tsx";
import MyAppointmentsPage from "./pages/Doctor/MyAppointmentsPage.tsx";
import MyAppointmentDetailPage from "./pages/Doctor/MyAppointmentDetailPage.tsx";
import UsersPage from "./pages/User/UsersPage.tsx";
import UserEditPage from "./pages/User/UserEditPage.tsx";
import UserAddPage from "./pages/User/UserAddPage.tsx";
import PatientSchedulePage from "./pages/Patient/PatientSchedulePage.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import CMSPage from "./pages/CMSPage.tsx";
import SettingFormPage from "./pages/Setting/SettingFormPage.tsx";
import PriceListFormPage from "./pages/PriceList/PriceListFormPage.tsx";
import PriceListsPage from "./pages/PriceList/PriceListsPage.tsx";
import PaymentMethodsPage from "./pages/PaymentMethod/PaymentMethodsPage.tsx";
import PaymentMethodFormPage from "./pages/PaymentMethod/PaymentMethodFormPage.tsx";
import InvoiceStatusesPage from "./pages/InvoiceStatus/InvoiceStatusesPage.tsx";
import InvoiceStatusFormPage from "./pages/InvoiceStatus/InvoiceStatusFormPage.tsx";
import InvoicesPage from "./pages/Invoice/InvoicesPage.tsx";
import InvoiceDetailsPage from "./pages/Invoice/InvoiceDetailsPage.tsx";
import InvoiceAddPage from "./pages/Invoice/InvoiceAddPage.tsx";
import InvoiceEditPage from "./pages/Invoice/InvoiceEditPage.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import createMyTheme from "./components/ui/MyTheme.tsx";
import {
	ThemeContextProvider,
	useThemeMode,
} from "./contexts/ThemeContext.tsx";
import InvoiceEditItemsPage from "./pages/Invoice/InvoiceEditItemsPage.tsx";
import InvoiceEditBuyerPage from "./pages/Invoice/InvoiceEditBuyerPage.tsx";
import TemplatesPage from "./pages/Template/TemplatesPage.tsx";
import TemplateFormPage from "./pages/Template/TemplateFormPage.tsx";
import DashboardSwitcher from "./components/switchers/DashboardSwitcher.tsx";
import ProfileSwitcher from "./components/switchers/ProfileSwitcher.tsx";
import { OwnerRoute } from "./components/routing/OwnerRoute.tsx";
import { PATHS } from "./routes/paths.ts";
import AppointmentFormPage from "./pages/Appointment/AppointmentFormPage.tsx";
import SettingsPage from "./pages/Setting/SettingsPage.tsx";
function AppContent() {
	const { mode } = useThemeMode();
	const theme = createMyTheme(mode);
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<StrictMode>
				<AuthProvider>
					<BrowserRouter
						future={{
							v7_startTransition: true,
							v7_relativeSplatPath: true,
						}}
					>
						<Routes>
							{}
							<Route
								path={PATHS.HOME}
								element={<Layout />}
							>
								<Route
									index
									element={<CMSPage />}
								/>
								<Route
									path={PATHS.ABOUT}
									element={<CMSPage />}
								/>
								<Route
									path={PATHS.CONTACT}
									element={<CMSPage />}
								/>
								<Route
									path={PATHS.SERVICES}
									element={<CMSPage />}
								/>
								<Route
									path={PATHS.LOGIN}
									element={<LoginPage />}
								/>
								<Route
									path={PATHS.REGISTER}
									element={<RegisterPage />}
								/>
								<Route
									path={PATHS.UNAUTHORIZED}
									element={<UnauthorizedPage />}
								/>
							</Route>
							{}
							<Route
								path={PATHS.HOME}
								element={
									<RoleBasedRoute>
										<RoleBasedLayout />
									</RoleBasedRoute>
								}
							>
								<Route
									path={PATHS.DASHBOARD}
									element={<DashboardSwitcher />}
								/>
								<Route
									path={PATHS.ACCOUNT}
									element={<AccountPage />}
								/>
								<Route
									path={PATHS.PROFILE}
									element={<ProfileSwitcher />}
								/>
								{}
								<Route
									path={PATHS.USERS}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<UsersPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.USERS_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<UserAddPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.USERS_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<UserEditPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.PATIENTS}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<PatientsPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.PATIENTS_ADD}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<PatientAddPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.PATIENTS_EDIT(":id")}
									element={
										<RoleBasedRoute
											allowedRoles={[
												"Admin",
												"Manager",
												"Receptionist",
												"Patient",
											]}
										>
											<OwnerRoute resourceType="patient">
												<PatientEditPage />
											</OwnerRoute>
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.PATIENTS_PROFILE(":id")}
									element={
										<RoleBasedRoute
											allowedRoles={[
												"Admin",
												"Manager",
												"Receptionist",
												"Doctor",
											]}
										>
											<PatientProfilePage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.SETTINGS}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<SettingsPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.SETTINGS_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<SettingFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.SETTINGS_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<SettingFormPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.DEPARTMENTS}
									element={<DepartmentsPage />}
								/>
								<Route
									path={PATHS.DEPARTMENTS_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<DepartmentFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DEPARTMENTS_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<DepartmentFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DISCOUNTS}
									element={
										<RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
											<DiscountPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DISCOUNTS_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
											<DiscountAddPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.SPECIALIZATIONS}
									element={<SpecializationPage />}
								/>
								<Route
									path={PATHS.SPECIALIZATIONS_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<SpecializationFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.SPECIALIZATIONS_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<SpecializationFormPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.APPOINTMENT_STATUSES}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<AppointmentStatusesPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.APPOINTMENT_STATUSES_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<AppointmentStatusFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.APPOINTMENT_STATUSES_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<AppointmentStatusFormPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.ROLES}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<RolesPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.ROLES_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<RoleAddPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.DOCS_TEMPLATES}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<TemplatesPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DOCS_TEMPLATES_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<TemplateFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DOCS_TEMPLATES_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<TemplateFormPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.APPOINTMENT_TYPES}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<AppointmentTypesPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.APPOINTMENT_TYPES_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<AppointmentTypeFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.APPOINTMENT_TYPES_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<AppointmentTypeFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.APPOINTMENTS}
									element={
										<RoleBasedRoute
											allowedRoles={[
												"Admin",
												"Manager",
												"Receptionist",
												"Doctor",
											]}
										>
											<AppointmentsPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.APPOINTMENTS_ADD}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<AppointmentFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.APPOINTMENTS_EDIT(":id")}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<AppointmentFormPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.DOCTORS}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<DoctorsPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DOCTORS_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<DoctorFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DOCTORS_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin", "Doctor"]}>
											<OwnerRoute resourceType="doctor">
												<DoctorFormPage />
											</OwnerRoute>
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DOCTORS_PROFILE(":id")}
									element={<DoctorProfilePage />}
								/>
								<Route
									path={PATHS.DOCTORS_SCHEDULE(":doctorId")}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<OwnerRoute resourceType="doctor">
												<DoctorSchedulePage />
											</OwnerRoute>
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DOCTORS_MY_SCHEDULE}
									element={
										<RoleBasedRoute
											allowedRoles={["Doctor"]}
										>
												<DoctorSchedulePage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DOCTORS_SCHEDULE_ADD(":doctorId")}
									element={
										<RoleBasedRoute allowedRoles={["Admin", "Doctor"]}>
											<OwnerRoute resourceType="doctor">
												<DoctorScheduleFormPage />
											</OwnerRoute>
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DOCTORS_SCHEDULE_EDIT(":doctorId", ":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin", "Doctor"]}>
											<OwnerRoute resourceType="doctor">
												<DoctorScheduleFormPage />
											</OwnerRoute>
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.DOCTOR.APPOINTMENTS_DETAILS(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Doctor"]}>
												<MyAppointmentDetailPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.DOCTORS_MY_APPOINTMENTS}
									element={
										<RoleBasedRoute allowedRoles={["Doctor"]}>
											<MyAppointmentsPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.PRICELISTS}
									element={
										<RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
											<PriceListsPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.PRICELISTS_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
											<PriceListFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.PRICELISTS_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
											<PriceListFormPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.PAYMENT_METHODS}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<PaymentMethodsPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.PAYMENT_METHODS_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<PaymentMethodFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.PAYMENT_METHODS_EDIT(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<PaymentMethodFormPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.INVOICE_STATUSES}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<InvoiceStatusesPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.INVOICE_STATUSES_ADD}
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<InvoiceStatusFormPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path="invoice-statuses/:id/edit"
									element={
										<RoleBasedRoute allowedRoles={["Admin"]}>
											<InvoiceStatusFormPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.INVOICES}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<InvoicesPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.INVOICES_ADD}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<InvoiceAddPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.INVOICES_ADD_BY_APPOINTMENT}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<InvoiceAddPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.INVOICES_EDIT(":id")}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<InvoiceEditPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.INVOICES_DETAILS(":id")}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<InvoiceDetailsPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.INVOICES_EDIT_ITEMS(":id")}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<InvoiceEditItemsPage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.INVOICES_EDIT_BUYER(":id")}
									element={
										<RoleBasedRoute
											allowedRoles={["Admin", "Manager", "Receptionist"]}
										>
											<InvoiceEditBuyerPage />
										</RoleBasedRoute>
									}
								/>
								{}
								<Route
									path={PATHS.PATIENT.SCHEDULE}
									element={
										<RoleBasedRoute allowedRoles={["Patient"]}>
											<PatientSchedulePage />
										</RoleBasedRoute>
									}
								/>
								<Route
									path={PATHS.PATIENT.APPOINTMENTS_DETAILS(":id")}
									element={
										<RoleBasedRoute allowedRoles={["Patient"]}>
											<AppointmentDetailsPage />
										</RoleBasedRoute>
									}
								/>
							</Route>
						</Routes>
					</BrowserRouter>
				</AuthProvider>
			</StrictMode>
		</ThemeProvider>
	);
}
createRoot(document.getElementById("root")!).render(
	<ThemeContextProvider>
		<AppContent />
	</ThemeContextProvider>,
);
