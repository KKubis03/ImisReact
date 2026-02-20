import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppointmentsService } from "../../api/services/appointments.service";
import { PatientsService } from "../../api/services/patients.service";
import { DoctorsService } from "../../api/services/doctors.service";
import { ScheduleService } from "../../api/services/schedule.service";
import { AppointmentTypesService } from "../../api/services/appointmentType.service";
import { AppointmentStatusesService } from "../../api/services/appointmentStatuses.service";
import type { SelectListItem } from "../../api/types/pagination";
import {
  validatePatientId,
  validateDoctorId,
  validateAppointmentDate,
  validateAppointmentTime,
} from "../../utils/validators";
import FormWrapper from "../../components/forms/FormWrapper";
import LoadingCircle from "../../components/ui/LoadingCircle";
import { FormSelect } from "../../components/forms/FormSelect";
import { FormInput } from "../../components/forms/FormInput";
import { SearchableModalSelect } from "../../components/forms/SearchableModalSelect";
import { PATHS } from "../../routes/paths";
import { useAuth } from "../../contexts/AuthContext";

export default function AppointmentFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentTypeId, setAppointmentTypeId] = useState("");
  const [appointmentStatusId, setAppointmentStatusId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({
    patientId: "",
    doctorId: "",
    appointmentTypeId: "",
    appointmentStatusId: "",
    date: "",
    time: "",
  });

  const [patients, setPatients] = useState<SelectListItem[]>([]);
  const [doctors, setDoctors] = useState<SelectListItem[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<SelectListItem[]>(
    [],
  );
  const [appointmentStatuses, setAppointmentStatuses] = useState<
    SelectListItem[]
  >([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadEditData();
    } else {
      loadAddData();
    }
  }, [id]);

  useEffect(() => {
    const doctorIdNum = Number(doctorId);
    if (doctorId && date && !isNaN(doctorIdNum) && doctorIdNum > 0) {
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
      if (!isEditMode) setTime("");
    }
  }, [doctorId, date]);

  const loadAddData = async () => {
    try {
      setLoadingData(true);
      const [patientsRes, doctorsRes, appointmentTypesRes] = await Promise.all([
        PatientsService.getSelectList(),
        DoctorsService.getSelectList(),
        AppointmentTypesService.getSelectList(),
      ]);
      setPatients(patientsRes);
      setDoctors(doctorsRes);
      setAppointmentTypes(appointmentTypesRes);
    } catch (error: any) {
      setError(error.message || "Failed to load form options");
    } finally {
      setLoadingData(false);
    }
  };

  const loadEditData = async () => {
    if (!id) return;
    try {
      setError("");
      setLoadingData(true);
      const [
        appointmentRes,
        patientsRes,
        doctorsRes,
        appointmentTypesRes,
        appointmentStatusesRes,
      ] = await Promise.all([
        AppointmentsService.getById(Number(id)),
        PatientsService.getSelectList(),
        DoctorsService.getSelectList(),
        AppointmentTypesService.getSelectList(),
        AppointmentStatusesService.getSelectList(),
      ]);
      setPatientId(String(appointmentRes.patient?.id || ""));
      setDoctorId(String(appointmentRes.doctor?.id || ""));
      setAppointmentTypeId(String(appointmentRes.appointmentTypeId || ""));
      const statusId = appointmentStatusesRes.find(
        (s) => s.displayName === appointmentRes.appointmentStatusName,
      )?.id;
      setAppointmentStatusId(String(statusId || ""));
      const dateTime = new Date(appointmentRes.appointmentDate);
      setDate(dateTime.toISOString().split("T")[0]);
      setTime(dateTime.toTimeString().substring(0, 5));
      setPatients(patientsRes);
      setDoctors(doctorsRes);
      setAppointmentTypes(appointmentTypesRes);
      setAppointmentStatuses(appointmentStatusesRes);
    } catch (error: any) {
      setError(error.message || "Failed to load appointment");
    } finally {
      setLoadingData(false);
    }
  };

  const loadAvailableSlots = async () => {
    const doctorIdNum = Number(doctorId);
    if (isNaN(doctorIdNum) || doctorIdNum <= 0) {
      setAvailableSlots([]);
      return;
    }
    try {
      setError("");
      setLoadingSlots(true);
      const dateObj = new Date(date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      let slots = await ScheduleService.getAvailableSlots(
        doctorIdNum,
        formattedDate,
      );
      if (isEditMode && time && !slots.includes(time)) {
        slots = [...slots, time];
      }
      slots.sort((a, b) => a.localeCompare(b));
      setAvailableSlots(slots);
      if (!isEditMode) setTime("");
    } catch (error: any) {
      setError(error.message || "Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      patientId: validatePatientId(patientId),
      doctorId: validateDoctorId(doctorId),
      appointmentTypeId: appointmentTypeId
        ? ""
        : "Appointment type is required",
      appointmentStatusId:
        isEditMode && hasRole("Admin") && !appointmentStatusId
          ? "Appointment status is required"
          : "",
      date: validateAppointmentDate(date),
      time: validateAppointmentTime(time),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e !== "")) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const appointmentDateTime = `${date}T${time}:00`;
      if (isEditMode) {
        await AppointmentsService.update(Number(id), {
          id: Number(id),
          patientId: Number(patientId),
          doctorId: Number(doctorId),
          appointmentStatusId: Number(appointmentStatusId),
          appointmentTypeId: Number(appointmentTypeId),
          appointmentDate: appointmentDateTime,
        });
        setSuccess("Appointment updated successfully!");
      } else {
        await AppointmentsService.create({
          patientId: Number(patientId),
          doctorId: Number(doctorId),
          appointmentTypeId: Number(appointmentTypeId),
          appointmentDate: appointmentDateTime,
        });
        setSuccess("Appointment created successfully!");
      }
      setTimeout(() => {
        isEditMode ? navigate(-1) : navigate(PATHS.APPOINTMENTS);
      }, 500);
    } catch (error: any) {
      setError(error.message || "Failed to save appointment");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <LoadingCircle />;

  return (
    <FormWrapper
      title={isEditMode ? "Edit Appointment" : "Add Appointment"}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      isLoading={loading}
      error={error}
      success={success}
    >
      <SearchableModalSelect
        label="Patient"
        value={patientId}
        options={patients}
        error={errors.patientId}
        onChange={(val) => {
          setPatientId(val);
          setErrors((prev) => ({
            ...prev,
            patientId: validatePatientId(val),
          }));
        }}
      />

      <SearchableModalSelect
        label="Doctor"
        value={doctorId}
        options={doctors}
        error={errors.doctorId}
        onChange={(val) => {
          setDoctorId(val);
          setErrors((prev) => ({ ...prev, doctorId: validateDoctorId(val) }));
        }}
      />

      <FormInput
        label="Appointment Date"
        type="date"
        value={date}
        shrink
        error={errors.date}
        onChange={(val) => {
          setDate(val);
          setErrors((prev) => ({
            ...prev,
            date: validateAppointmentDate(val),
          }));
        }}
      />

      <FormSelect
        label="Appointment Time"
        value={time}
        options={availableSlots.map((s) => ({ id: s, displayName: s }))}
        disabled={!doctorId || !date || loadingSlots}
        error={errors.time}
        helperText={
          !doctorId || !date
            ? "Please select doctor and date first"
            : loadingSlots
              ? "Loading..."
              : ""
        }
        onChange={(val) => {
          setTime(val);
          setErrors((prev) => ({
            ...prev,
            time: validateAppointmentTime(val),
          }));
        }}
      />

      <SearchableModalSelect
				label="Appointment Type"
				value={appointmentTypeId}
				options={appointmentTypes}
				error={errors.appointmentTypeId}
				onChange={(val) => {
					setAppointmentTypeId(val);
					setErrors((prev) => ({
						...prev,
						appointmentTypeId: val ? "" : "Appointment type is required",
					}));
				}}
			/>

      {isEditMode && hasRole("Admin") && (
        <FormSelect
          label="Appointment Status"
          value={appointmentStatusId}
          options={appointmentStatuses}
          error={errors.appointmentStatusId}
          onChange={(val) => {
            setAppointmentStatusId(val);
            setErrors((prev) => ({
              ...prev,
              appointmentStatusId: val ? "" : "Appointment status is required",
            }));
          }}
          required
        />
      )}
    </FormWrapper>
  );
}
