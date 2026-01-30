import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { RoleBasedRoute } from "./components/ProtectedRoute.tsx";
import Layout from "./components/Layout.tsx";
import AdminLayout from "./components/AdminLayout.tsx";
import DoctorLayout from "./components/DoctorLayout.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.tsx";
import "./index.css";
import HomePage from "./pages/HomePage.tsx";
import PatientsPage from "./pages/Patient/PatientsPage.tsx";
import PatientAddPage from "./pages/Patient/PatientAddPage.tsx";
import PatientEditPage from "./pages/Patient/PatientEditPage.tsx";
import PatientProfilePage from "./pages/Patient/PatientProfilePage.tsx";
import DepartmentsPage from "./pages/Department/DepartmentsPage.tsx";
import DepartmentAddPage from "./pages/Department/DepartmentAddPage.tsx";
import DepartmentEditPage from "./pages/Department/DepartmentEditPage.tsx";
import DiscountPage from "./pages/Discount/DiscountPage.tsx";
import DiscountAddPage from "./pages/Discount/DiscountAddPage.tsx";
import SpecializationPage from "./pages/Specialization/SpecializationPage.tsx";
import SpecializationAddPage from "./pages/Specialization/SpecializationAddPage.tsx";
import SpecializationEditPage from "./pages/Specialization/SpecializationEditPage.tsx";
import AppointmentStatusesPage from "./pages/AppointmentStatus/AppointmentStatusesPage.tsx";
import AppointmentStatusAddPage from "./pages/AppointmentStatus/AppointmentStatusAddPage.tsx";
import AppointmentStatusEditPage from "./pages/AppointmentStatus/AppointmentStatusEditPage.tsx";
import AppointmentTypesPage from "./pages/AppointmentType/AppointmentTypesPage.tsx";
import AppointmentTypeAddPage from "./pages/AppointmentType/AppointmentTypeAddPage.tsx";
import AppointmentTypeEditPage from "./pages/AppointmentType/AppointmentTypeEditPage.tsx";
import AppointmentsPage from "./pages/Appointment/AppointmentsPage.tsx";
import AppointmentAddPage from "./pages/Appointment/AppointmentAddPage.tsx";
import AppointmentEditPage from "./pages/Appointment/AppointmentEditPage.tsx";
import AppointmentDetailsPage from "./pages/Appointment/AppointmentDetailsPage.tsx";
import AppointmentDetailsEditPage from "./pages/Appointment/AppointmentDetailsEditPage.tsx";
import DoctorsPage from "./pages/Doctor/DoctorsPage.tsx";
import DoctorAddPage from "./pages/Doctor/DoctorAddPage.tsx";
import DoctorEditPage from "./pages/Doctor/DoctorEditPage.tsx";
import DoctorSchedulePage from "./pages/Doctor/DoctorSchedulePage.tsx";
import DoctorScheduleAddPage from "./pages/Doctor/DoctorScheduleAddPage.tsx";
import DoctorScheduleEditPage from "./pages/Doctor/DoctorScheduleEditPage.tsx";
import SchedulePage from "./pages/Schedule/SchedulePage.tsx";
import ScheduleAddPage from "./pages/Schedule/ScheduleAddPage.tsx";
import ScheduleEditPage from "./pages/Schedule/ScheduleEditPage.tsx";
import MySchedulePage from "./pages/Doctor/MySchedulePage.tsx";
import MyAppointmentsPage from "./pages/Doctor/MyAppointmentsPage.tsx";
import MyAppointmentDetailPage from "./pages/Doctor/MyAppointmentDetailPage.tsx";
import MyScheduleEditPage from "./pages/Doctor/MyScheduleEditPage.tsx";
import MyScheduleAddPage from "./pages/Doctor/MyScheduleAddPage.tsx";
import UsersPage from "./pages/User/UsersPage.tsx";
import UserEditPage from "./pages/User/UserEditPage.tsx";
import PatientLayout from "./components/PatientLayout.tsx";
import PatientSchedulePage from "./pages/Patient/PatientSchedulePage.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import SettingEditPage from "./pages/Setting/SettingEditPage.tsx";
import SettingsPage from "./pages/Setting/SettingsPage.tsx";
import SettingAddPage from "./pages/Setting/SettingAddPage.tsx";
import PriceListAddPage from "./pages/PriceList/PriceListAddPage.tsx";
import PriceListEditPage from "./pages/PriceList/PriceListEditPage.tsx";
import PriceListsPage from "./pages/PriceList/PriceListsPage.tsx";
import PaymentMethodsPage from "./pages/PaymentMethod/PaymentMethodsPage.tsx";
import PaymentMethodAddPage from "./pages/PaymentMethod/PaymentMethodAddPage.tsx";
import PaymentMethodEditPage from "./pages/PaymentMethod/PaymentMethodEditPage.tsx";
import InvoiceStatusesPage from "./pages/InvoiceStatus/InvoiceStatusesPage.tsx";
import InvoiceStatusEditPage from "./pages/InvoiceStatus/InvoiceStatusEditPage.tsx";
import InvoiceStatusAddPage from "./pages/InvoiceStatus/InvoiceStatusAddPage.tsx";
import InvoicesPage from "./pages/Invoice/InvoicesPage.tsx";
import InvoiceDetailsPage from "./pages/Invoice/InvoiceDetailsPage.tsx";
import InvoiceAddPage from "./pages/Invoice/InvoiceAddPage.tsx";
import InvoiceAddByAppointmentPage from "./pages/Invoice/InvoiceAddByAppointmentPage.tsx";
import InvoiceEditPage from "./pages/Invoice/InvoiceEditPage.tsx";
import myTheme from "./components/MyTheme.tsx";
import { ThemeProvider } from "@mui/material/styles";
import InvoiceEditItemsPage from "./pages/Invoice/InvoiceEditItemsPage.tsx";
import InvoiceEditBuyerPage from "./pages/Invoice/InvoiceEditBuyerPage.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={myTheme}>
    <StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Publiczne Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />
            </Route>

            {/* Admin Routes - wymagają roli Admin */}
            <Route
              path="/"
              element={
                <RoleBasedRoute allowedRoles={["Admin"]}>
                  <AdminLayout />
                </RoleBasedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="account" element={<AccountPage />} />

              <Route path="users" element={<UsersPage />} />
              <Route path="users/edit/:id" element={<UserEditPage />} />

              <Route path="patients" element={<PatientsPage />} />
              <Route path="patients/add" element={<PatientAddPage />} />
              <Route path="patients/edit/:id" element={<PatientEditPage />} />
              <Route
                path="patients/profile/:id"
                element={<PatientProfilePage />}
              />

              <Route path="settings" element={<SettingsPage />} />
              <Route path="settings/edit/:id" element={<SettingEditPage />} />
              <Route path="settings/add" element={<SettingAddPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="departments/add" element={<DepartmentAddPage />} />
              <Route
                path="departments/edit/:id"
                element={<DepartmentEditPage />}
              />

              <Route path="discount" element={<DiscountPage />} />
              <Route path="discount/add" element={<DiscountAddPage />} />

              <Route path="specializations" element={<SpecializationPage />} />
              <Route
                path="specializations/add"
                element={<SpecializationAddPage />}
              />
              <Route
                path="specializations/edit/:id"
                element={<SpecializationEditPage />}
              />

              <Route
                path="appointment-statuses"
                element={<AppointmentStatusesPage />}
              />
              <Route
                path="appointment-statuses/add"
                element={<AppointmentStatusAddPage />}
              />
              <Route
                path="appointment-statuses/edit/:id"
                element={<AppointmentStatusEditPage />}
              />

              <Route
                path="appointment-types"
                element={<AppointmentTypesPage />}
              />
              <Route
                path="appointment-types/add"
                element={<AppointmentTypeAddPage />}
              />
              <Route
                path="appointment-types/edit/:id"
                element={<AppointmentTypeEditPage />}
              />

              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="appointments/add" element={<AppointmentAddPage />} />
              <Route
                path="appointments/edit/:id"
                element={<AppointmentEditPage />}
              />
              <Route
                path="appointments/details/:id"
                element={<AppointmentDetailsPage />}
              />
              <Route
                path="appointments/details/:id/edit"
                element={<AppointmentDetailsEditPage />}
              />

              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="doctors/add" element={<DoctorAddPage />} />
              <Route path="doctors/edit/:id" element={<DoctorEditPage />} />
              <Route
                path="doctors/:doctorId/schedule"
                element={<DoctorSchedulePage />}
              />
              <Route
                path="doctors/:doctorId/schedule/add"
                element={<DoctorScheduleAddPage />}
              />
              <Route
                path="doctors/:doctorId/schedule/edit/:id"
                element={<DoctorScheduleEditPage />}
              />

              <Route path="schedules" element={<SchedulePage />} />
              <Route path="schedules/add" element={<ScheduleAddPage />} />
              <Route path="schedules/edit/:id" element={<ScheduleEditPage />} />

              <Route path="pricelist" element={<PriceListsPage />} />
              <Route path="pricelist/add" element={<PriceListAddPage />} />
              <Route
                path="pricelist/edit/:id"
                element={<PriceListEditPage />}
              />

              <Route path="payment-methods" element={<PaymentMethodsPage />} />
              <Route
                path="payment-methods/add"
                element={<PaymentMethodAddPage />}
              />
              <Route
                path="payment-methods/edit/:id"
                element={<PaymentMethodEditPage />}
              />

              <Route
                path="invoice-statuses"
                element={<InvoiceStatusesPage />}
              />
              <Route
                path="invoice-statuses/add"
                element={<InvoiceStatusAddPage />}
              />
              <Route
                path="invoice-statuses/edit/:id"
                element={<InvoiceStatusEditPage />}
              />

              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="invoices/add" element={<InvoiceAddPage />} />
              <Route
                path="invoices/add-by-appointment"
                element={<InvoiceAddByAppointmentPage />}
              />
              <Route path="invoices/edit/:id" element={<InvoiceEditPage />} />
              <Route path="invoices/:id" element={<InvoiceDetailsPage />} />
              <Route
                path="invoices/edit-items/:id"
                element={<InvoiceEditItemsPage />}
              />
              <Route
                path="invoices/edit-buyer/:id"
                element={<InvoiceEditBuyerPage />}
              />
            </Route>

            {/* Doctor Routes - wymagają roli Doctor */}
            <Route
              path="/doctor"
              element={
                <RoleBasedRoute allowedRoles={["Doctor"]}>
                  <DoctorLayout />
                </RoleBasedRoute>
              }
            >
              <Route path="patients" element={<PatientsPage />} />
              <Route
                path="patients/profile/:id"
                element={<PatientProfilePage />}
              />
              <Route path="schedule" element={<MySchedulePage />} />
              <Route path="schedule/add" element={<MyScheduleAddPage />} />
              <Route
                path="schedule/edit/:id"
                element={<MyScheduleEditPage />}
              />
              <Route path="appointments" element={<MyAppointmentsPage />} />
              <Route
                path="appointments/:id"
                element={<MyAppointmentDetailPage />}
              />
              <Route
                path="appointments/details/:id"
                element={<AppointmentDetailsPage />}
              />
              <Route path="account" element={<AccountPage />} />
            </Route>

            {/* Patient Routes - wymagają roli Patient */}
            <Route
              path="/patient"
              element={
                <RoleBasedRoute allowedRoles={["Patient"]}>
                  <PatientLayout />
                </RoleBasedRoute>
              }
            >
              <Route path="profile" element={<PatientProfilePage />} />
              <Route path="profile/edit" element={<PatientEditPage />} />
              <Route path="schedule" element={<PatientSchedulePage />} />
              <Route
                path="appointments/:id"
                element={<MyAppointmentDetailPage />}
              />
              <Route
                path="appointments/details/:id"
                element={<AppointmentDetailsPage />}
              />
              <Route path="account" element={<AccountPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </StrictMode>
  </ThemeProvider>,
);
