import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	TextField,
	MenuItem,
	CircularProgress,
	Container,
} from "@mui/material";
import { AppointmentsService } from "../../api/services/appointments.service";
import { DoctorsService } from "../../api/services/doctors.service";
import { ScheduleService } from "../../api/services/schedule.service";
import { AppointmentTypesService } from "../../api/services/appointmentType.service";
import type { SelectListItem } from "../../api/types/pagination";
import type { AppointmentType } from "../../api/services/appointmentType.service";
import { useAuth } from "../../contexts/AuthContext";
import {
	validateDoctorId,
	validateAppointmentDate,
	validateAppointmentTime,
} from "../../utils/validators";
import FormWrapper from "../../components/forms/FormWrapper";
import { SearchableModalSelect } from "../../components/forms/SearchableModalSelect";
import { FormInput } from "../../components/forms/FormInput";

export default function PatientSchedulePage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [doctorId, setDoctorId] = useState("");
	const [appointmentTypeId, setAppointmentTypeId] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({
		doctorId: "",
		appointmentTypeId: "",
		date: "",
		time: "",
	});
	const [doctors, setDoctors] = useState<SelectListItem[]>([]);
	const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(
		[],
	);
	const [availableSlots, setAvailableSlots] = useState<string[]>([]);
	const [loadingSlots, setLoadingSlots] = useState(false);
	const [loadingData, setLoadingData] = useState(true);
	useEffect(() => {
		loadOptions();
	}, []);
	useEffect(() => {
		if (doctorId && date) {
			loadAvailableSlots();
		} else {
			setAvailableSlots([]);
			setTime("");
		}
	}, [doctorId, date]);
	const loadOptions = async () => {
		try {
			setLoadingData(true);
			const [doctorsRes, appointmentTypesRes] = await Promise.all([
				DoctorsService.getSelectList(),
				AppointmentTypesService.getAll(),
			]);
			setDoctors(doctorsRes);
			setAppointmentTypes(appointmentTypesRes.items);
		} catch (err) {
			setError("Failed to load form options");
		} finally {
			setLoadingData(false);
		}
	};
	const loadAvailableSlots = async () => {
		try {
			setLoadingSlots(true);
			const dateObj = new Date(date);
			const day = String(dateObj.getDate()).padStart(2, "0");
			const month = String(dateObj.getMonth() + 1).padStart(2, "0");
			const year = dateObj.getFullYear();
			const formattedDate = `${day}.${month}.${year}`;
			const response = await ScheduleService.getAvailableSlots(
				Number(doctorId),
				formattedDate,
			);
			setAvailableSlots(response);
			setTime("");
		} catch (err) {
			setError("Failed to load available time slots");
			setAvailableSlots([]);
		} finally {
			setLoadingSlots(false);
		}
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.patientId) {
			setError("Patient ID not found. Please contact support.");
			return;
		}
		const newErrors = {
			doctorId: validateDoctorId(doctorId),
			appointmentTypeId: appointmentTypeId
				? ""
				: "Appointment type is required",
			date: validateAppointmentDate(date),
			time: validateAppointmentTime(time),
		};
		setErrors(newErrors);
		const hasErrors = Object.values(newErrors).some((error) => error !== "");
		if (hasErrors) {
			setError("Please fill in all required fields");
			return;
		}
		try {
			setLoading(true);
			setError("");
			const appointmentDateTime = `${date}T${time}:00`;
			await AppointmentsService.create({
				patientId: user.patientId,
				doctorId: Number(doctorId),
				appointmentTypeId: Number(appointmentTypeId),
				appointmentDate: appointmentDateTime,
			});
			setSuccess("Appointment scheduled successfully!");
			setTimeout(() => {
				navigate(-1);
			}, 500);
		} catch (err: any) {
			setError(err || "Failed to schedule appointment");
		} finally {
			setLoading(false);
		}
	};
	const appointmentTypeOptions: SelectListItem[] = appointmentTypes.map((t) => ({
		id: t.id,
		displayName: t.name,
	}));

	if (loadingData) {
		return (
			<Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
				<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}

	return (
		<FormWrapper
			title="Schedule Appointment"
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isLoading={loading}
			error={error}
			success={success}
			submitLabel="Schedule"
		>
			<SearchableModalSelect
				label="Doctor"
				value={doctorId}
				options={doctors}
				error={errors.doctorId}
				onChange={(val) => {
					setDoctorId(val);
					setErrors((prev) => ({
						...prev,
						doctorId: validateDoctorId(val),
					}));
				}}
			/>

			<SearchableModalSelect
				label="Appointment Type"
				value={appointmentTypeId}
				options={appointmentTypeOptions}
				error={errors.appointmentTypeId}
				onChange={(val) => {
					setAppointmentTypeId(val);
					setErrors((prev) => ({
						...prev,
						appointmentTypeId: val ? "" : "Appointment type is required",
					}));
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
			
			<TextField
				fullWidth
				select
				label="Appointment Time"
				value={time}
				onChange={(e) => {
					setTime(e.target.value);
					setErrors((prev) => ({
						...prev,
						time: validateAppointmentTime(e.target.value),
					}));
				}}
				margin="normal"
				required
				disabled={!doctorId || !date || loadingSlots}
				error={!!errors.time}
				helperText={
					errors.time ||
					(!doctorId || !date
						? "Please select doctor and date first"
						: loadingSlots
							? "Loading available times..."
							: availableSlots.length === 0
								? "No available time slots"
								: "")
				}
			>
				{availableSlots.map((slot) => (
					<MenuItem key={slot} value={slot}>
						{slot}
					</MenuItem>
				))}
			</TextField>
		</FormWrapper>
	);
}
