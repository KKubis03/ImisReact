import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItem, TextField, Typography, Box } from "@mui/material";
import { ScheduleService } from "../../api/services/schedule.service";
import { DoctorsService } from "../../api/services/doctors.service";
import type { SelectListItem } from "../../api/types/pagination";
import { useAuth } from "../../contexts/AuthContext";
import FormWrapper from "../../components/forms/FormWrapper";
import { validateScheduleTime, validateScheduleDuration } from "../../utils/validators";

const DAYS_OF_WEEK = [
	{ id: 0, name: "Sunday" },
	{ id: 1, name: "Monday" },
	{ id: 2, name: "Tuesday" },
	{ id: 3, name: "Wednesday" },
	{ id: 4, name: "Thursday" },
	{ id: 5, name: "Friday" },
	{ id: 6, name: "Saturday" },
];

const STANDARD_DURATIONS = ["00:15:00", "00:20:00", "00:30:00", "00:45:00", "01:00:00"];

export default function DoctorScheduleFormPage() {
	const navigate = useNavigate();
	const { doctorId, id } = useParams<{ doctorId?: string; id?: string }>();
	const { user, hasRole } = useAuth();
	const isEdit = !!id;
	const isAdmin = hasRole("Admin");

	const effectiveDoctorId = isAdmin ? doctorId : String(user?.doctorId ?? "");

	const [doctorsList, setDoctorsList] = useState<SelectListItem[]>([]);
	const [selectedDoctorId, setSelectedDoctorId] = useState(effectiveDoctorId ?? "");
	const [existingScheduleDays, setExistingScheduleDays] = useState<number[]>([]);

	const [dayOfTheWeek, setDayOfTheWeek] = useState("");
	const [startTime, setStartTime] = useState("08:00");
	const [endTime, setEndTime] = useState("16:00");
	const [slotDuration, setSlotDuration] = useState("00:30:00");
	const [isCustomDuration, setIsCustomDuration] = useState(false);
	const [customDurationMinutes, setCustomDurationMinutes] = useState("");

	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [errors, setErrors] = useState({
		doctorId: "",
		dayOfTheWeek: "",
		startTime: "",
		endTime: "",
		slotDuration: "",
	});

	useEffect(() => {
		const init = async () => {
			setLoadingData(true);
			try {
				const [doctors] = await Promise.all([
					isAdmin ? DoctorsService.getSelectList() : Promise.resolve([]),
				]);
				setDoctorsList(doctors);

				const resolvedDoctorId = isAdmin ? doctorId : String(user?.doctorId ?? "");

				if (isEdit && id) {
					const schedule = await ScheduleService.getById(Number(id));
					setDayOfTheWeek(String(schedule.dayOfTheWeek));
					setStartTime(schedule.startTime.substring(0, 5));
					setEndTime(schedule.endTime.substring(0, 5));
					if (STANDARD_DURATIONS.includes(schedule.slotDuration)) {
						setSlotDuration(schedule.slotDuration);
						setIsCustomDuration(false);
					} else {
						setSlotDuration("custom");
						setIsCustomDuration(true);
						const [h, m] = schedule.slotDuration.split(":").map(Number);
						setCustomDurationMinutes(String(h * 60 + m));
					}
					setSelectedDoctorId(String(schedule.doctorId));
				} else if (resolvedDoctorId) {
					setSelectedDoctorId(resolvedDoctorId);
					const existing = await ScheduleService.getByDoctorId(Number(resolvedDoctorId));
					setExistingScheduleDays(existing.map((s) => Number(s.dayOfTheWeek)));
				}
			} catch {
				setError("Failed to load data");
			} finally {
				setLoadingData(false);
			}
		};

		init();
	}, [id, doctorId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const timeError = validateScheduleTime(startTime, endTime);
		const customDurationError = validateScheduleDuration(isCustomDuration, customDurationMinutes);

		const newErrors = {
			doctorId: isAdmin && !selectedDoctorId ? "Doctor is required" : "",
			dayOfTheWeek: dayOfTheWeek === "" ? "Day of the week is required" : "",
			startTime: !startTime ? "Start time is required" : timeError,
			endTime: !endTime ? "End time is required" : "",
			slotDuration:
				customDurationError ||
				(!slotDuration && !isCustomDuration ? "Slot duration is required" : ""),
		};
		setErrors(newErrors);

		if (Object.values(newErrors).some((e) => e !== "")) {
			setError("Please fix all validation errors");
			return;
		}

		let finalSlotDuration = slotDuration;
		if (isCustomDuration && customDurationMinutes) {
			const minutes = Number(customDurationMinutes);
			const h = Math.floor(minutes / 60);
			const m = minutes % 60;
			finalSlotDuration = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
		}

		const resolvedDoctorId = Number(isAdmin ? selectedDoctorId : effectiveDoctorId);

		try {
			setLoading(true);
			setError("");

			if (isEdit && id) {
				await ScheduleService.update(Number(id), {
					id: Number(id),
					doctorId: resolvedDoctorId,
					dayOfTheWeek: Number(dayOfTheWeek),
					startTime: startTime + ":00",
					endTime: endTime + ":00",
					slotDuration: finalSlotDuration,
				});
				setSuccess("Schedule updated successfully!");
			} else {
				await ScheduleService.create({
					doctorId: resolvedDoctorId,
					dayOfTheWeek: Number(dayOfTheWeek),
					startTime: startTime + ":00",
					endTime: endTime + ":00",
					slotDuration: finalSlotDuration,
				});
				setSuccess("Schedule created successfully!");
			}

			setTimeout(() => navigate(-1), 500);
		} catch {
			setError(isEdit ? "Failed to update schedule" : "Failed to create schedule");
		} finally {
			setLoading(false);
		}
	};

	const availableDays = isEdit
		? DAYS_OF_WEEK
		: DAYS_OF_WEEK.filter((day) => !existingScheduleDays.includes(day.id));

	return (
		<FormWrapper
			title={isEdit ? "Edit Schedule" : "Add Schedule"}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isLoading={loading || loadingData}
			error={error}
			success={success}
			submitLabel={isEdit ? "Update Schedule" : "Create Schedule"}
		>
			{isAdmin && (
				<TextField
					fullWidth
					select
					label="Doctor"
					value={selectedDoctorId}
					onChange={(e) => {
						setSelectedDoctorId(e.target.value);
						setErrors((prev) => ({
							...prev,
							doctorId: !e.target.value ? "Doctor is required" : "",
						}));
					}}
					margin="normal"
					required
					error={!!errors.doctorId}
					helperText={errors.doctorId}
				>
					{doctorsList.map((d) => (
						<MenuItem key={d.id} value={d.id}>
							{d.displayName}
						</MenuItem>
					))}
				</TextField>
			)}

			{isEdit ? (
				<Box sx={{ mb: 1, mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
					<Typography variant="body2" color="text.secondary">
						Day of the Week
					</Typography>
					<Typography variant="body1" sx={{ fontWeight: 500 }}>
						{DAYS_OF_WEEK.find((d) => d.id === Number(dayOfTheWeek))?.name ?? "Unknown"}
					</Typography>
				</Box>
			) : (
			<TextField
					fullWidth
					select
					label="Day of the Week"
					value={dayOfTheWeek}
					onChange={(e) => {
						setDayOfTheWeek(e.target.value);
						setErrors((prev) => ({
							...prev,
							dayOfTheWeek: e.target.value === "" ? "Day of the week is required" : "",
						}));
					}}
					margin="normal"
					required
					error={!!errors.dayOfTheWeek}
					helperText={errors.dayOfTheWeek}
				>
					{availableDays.map((day) => (
						<MenuItem key={day.id} value={day.id}>
							{day.name}
						</MenuItem>
					))}
				</TextField>
			)}

			<TextField
				fullWidth
				label="Start Time"
				type="time"
				value={startTime}
				onChange={(e) => {
					setStartTime(e.target.value);
					const timeError = validateScheduleTime(e.target.value, endTime);
					setErrors((prev) => ({
						...prev,
						startTime: !e.target.value ? "Start time is required" : timeError,
					}));
				}}
				margin="normal"
				InputLabelProps={{ shrink: true }}
				required
				error={!!errors.startTime}
				helperText={errors.startTime}
			/>

			<TextField
				fullWidth
				label="End Time"
				type="time"
				value={endTime}
				onChange={(e) => {
					setEndTime(e.target.value);
					const timeError = validateScheduleTime(startTime, e.target.value);
					setErrors((prev) => ({
						...prev,
						endTime: !e.target.value ? "End time is required" : "",
						startTime: timeError,
					}));
				}}
				margin="normal"
				InputLabelProps={{ shrink: true }}
				required
				error={!!errors.endTime}
				helperText={errors.endTime}
			/>

			<TextField
				fullWidth
				select
				label="Slot Duration"
				value={slotDuration}
				onChange={(e) => {
					const value = e.target.value;
					setSlotDuration(value);
					setIsCustomDuration(value === "custom");
					setErrors((prev) => ({
						...prev,
						slotDuration: !value ? "Slot duration is required" : "",
					}));
				}}
				margin="normal"
				required
				error={!!errors.slotDuration}
				helperText={errors.slotDuration}
			>
				<MenuItem value="00:15:00">15 minutes</MenuItem>
				<MenuItem value="00:20:00">20 minutes</MenuItem>
				<MenuItem value="00:30:00">30 minutes</MenuItem>
				<MenuItem value="00:45:00">45 minutes</MenuItem>
				<MenuItem value="01:00:00">1 hour</MenuItem>
				<MenuItem value="custom">Custom duration...</MenuItem>
			</TextField>

			{isCustomDuration && (
				<TextField
					fullWidth
					label="Custom Duration (minutes)"
					type="number"
					value={customDurationMinutes}
					onChange={(e) => {
						setCustomDurationMinutes(e.target.value);
						const minutes = Number(e.target.value);
						let err = "";
						if (!e.target.value) err = "Custom duration is required";
						else if (isNaN(minutes) || minutes <= 0) err = "Duration must be a positive number";
						else if (minutes > 240) err = "Duration cannot exceed 240 minutes";
						setErrors((prev) => ({ ...prev, slotDuration: err }));
					}}
					margin="normal"
					required
					error={!!errors.slotDuration}
					helperText={errors.slotDuration || "Enter duration in minutes (1–240)"}
					inputProps={{ min: 1, max: 240 }}
				/>
			)}
		</FormWrapper>
	);
}
