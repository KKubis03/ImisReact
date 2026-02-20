import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import {
	Typography,
	Box,
	Paper,
	Container,
	TextField,
	Button,
	CircularProgress,
	Alert,
	Divider,
	Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
	AppointmentsService,
	type AppointmentWithDetails,
} from "../../api/services/appointments.service";
import { AppointmentDetailsService } from "../../api/services/appointmentDetails.service";
import { PATHS } from "../../routes/paths";
import Header from "../../components/layout/Header";

export default function MyAppointmentDetailPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams<{ id: string }>();
	const selectedDate = (location.state as any)?.selectedDate;
	const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const isCompleted = appointment?.appointmentStatusName?.toLowerCase() === "completed";
	const [formData, setFormData] = useState({
		notes: "",
		diagnosis: "",
		recommendations: "",
	});
	useEffect(() => {
		loadAppointmentData();
	}, [id]);
	const loadAppointmentData = async () => {
		if (!id) {
			setError("Invalid appointment ID");
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const appointmentResponse = await AppointmentsService.getWithDetails(
				parseInt(id),
			);
			setAppointment(appointmentResponse);
			if (appointmentResponse.details) {
				setFormData({
					notes: appointmentResponse.details.notes ?? "",
					diagnosis: appointmentResponse.details.diagnosis ?? "",
					recommendations: appointmentResponse.details.recommendations ?? "",
				});
			}
			setError("");
		} catch (err: any) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	const handleSave = async () => {
		if (!id) return;
		try {
			setSaving(true);
			setError("");
			const appointmentDetailsData = {
				appointmentId: parseInt(id),
				notes: formData.notes || null,
				diagnosis: formData.diagnosis || null,
				recommendations: formData.recommendations || null,
			};
			const existingDetailsId = appointment?.details?.id ?? null;
			if (existingDetailsId) {
				await AppointmentDetailsService.update(existingDetailsId, {
					id: existingDetailsId,
					...appointmentDetailsData,
				});
			} else {
				await AppointmentDetailsService.create(appointmentDetailsData);
			}
			setSuccessMessage("Appointment details saved successfully!");
			setTimeout(() => {
				navigate(PATHS.DOCTORS_MY_APPOINTMENTS, {
					state: { selectedDate },
				});
			}, 500);
		} catch (err: any) {
			console.error("Error saving appointment details:", err);
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"Failed to save appointment details";
			setError(errorMessage);
		} finally {
			setSaving(false);
		}
	};
	const handleSaveAndComplete = async () => {
		if (!id) return;
		try {
			setSaving(true);
			setError("");
			const appointmentDetailsData = {
				appointmentId: parseInt(id),
				notes: formData.notes || null,
				diagnosis: formData.diagnosis || null,
				recommendations: formData.recommendations || null,
			};
			const existingDetailsId = appointment?.details?.id ?? null;
			if (existingDetailsId) {
				await AppointmentDetailsService.update(existingDetailsId, {
					id: existingDetailsId,
					...appointmentDetailsData,
				});
			} else {
				await AppointmentDetailsService.create(appointmentDetailsData);
			}
			await AppointmentsService.complete(parseInt(id));
			setSuccessMessage("Appointment saved and completed successfully!");
			setTimeout(() => {
				navigate(PATHS.DOCTORS_MY_APPOINTMENTS, {
					state: { selectedDate },
				});
			}, 500);
		} catch (err: any) {
			console.error("Error saving and completing appointment:", err);
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"Failed to save and complete appointment";
			setError(errorMessage);
		} finally {
			setSaving(false);
		}
	};
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};
	if (loading) {
		return (
			<Container
				maxWidth="md"
				sx={{ py: 4 }}
			>
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}
	if (!appointment) {
		return (
			<Container
				maxWidth="md"
				sx={{ py: 4 }}
			>
				<Alert severity="error">{error}</Alert>
				<Tooltip title="Go back">
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() =>
							navigate(PATHS.DOCTORS_MY_APPOINTMENTS, {
								state: { selectedDate },
							})
						}
						sx={{ mt: 2 }}
					>
						Back
					</Button>
				</Tooltip>
			</Container>
		);
	}
	return (
		<Container
			maxWidth="md"
			sx={{ py: 4 }}
		>
			<Header title="Appointment Details" />
			{error && (
				<Alert
					severity="error"
					sx={{ mb: 3 }}
				>
					{error}
				</Alert>
			)}
			{successMessage && (
				<Alert
					severity="success"
					sx={{ mb: 3 }}
				>
					{successMessage}
				</Alert>
			)}
			<Paper sx={{ p: 3, mb: 3 }}>
				<Typography
					variant="h6"
					gutterBottom
					color="primary"
				>
					Appointment Information
				</Typography>
				<Divider sx={{ mb: 2 }} />
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
						gap: 2,
					}}
				>
					<Box>
						<Typography
							variant="subtitle2"
							color="text.secondary"
						>
							Patient
						</Typography>
						<Link
							to={PATHS.PATIENTS_PROFILE(appointment.patient?.id ?? "")}
							style={{
								textDecoration: "none",
								color: "inherit",
								fontWeight: 500,
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.textDecoration = "underline";
								e.currentTarget.style.color = "#1976d2";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.textDecoration = "none";
								e.currentTarget.style.color = "inherit";
							}}
						>
							{appointment.patient?.firstName} {appointment.patient?.lastName}
						</Link>
					</Box>
					<Box>
						<Typography
							variant="subtitle2"
							color="text.secondary"
						>
							Date and Time
						</Typography>
						<Typography variant="body1">
							{formatDate(appointment.appointmentDate)}
						</Typography>
					</Box>
					<Box>
						<Typography
							variant="subtitle2"
							color="text.secondary"
						>
							Status
						</Typography>
						<Typography variant="body1">
							{appointment.appointmentStatusName}
						</Typography>
					</Box>
					<Box>
						<Typography
							variant="subtitle2"
							color="text.secondary"
						>
							Appointment Type
						</Typography>
						<Typography variant="body1">
							{appointment.appointmentTypeName}
						</Typography>
					</Box>
				</Box>
			</Paper>
			<Paper sx={{ p: 3 }}>
				<Typography
					variant="h6"
					gutterBottom
					color="primary"
				>
					Appointment Details
				</Typography>
				<Divider sx={{ mb: 3 }} />
				<Box
					component="form"
					noValidate
				>
					{isCompleted && (
						<Alert severity="info" sx={{ mb: 2 }}>
							This appointment is completed and cannot be edited.
						</Alert>
					)}
					<TextField
						fullWidth
						label="Notes"
						name="notes"
						value={formData.notes}
						onChange={handleChange}
						multiline
						rows={4}
						margin="normal"
						placeholder="Enter notes from the visit..."
						disabled={isCompleted}
					/>
					<TextField
						fullWidth
						label="Diagnosis"
						name="diagnosis"
						value={formData.diagnosis}
						onChange={handleChange}
						multiline
						rows={4}
						margin="normal"
						placeholder="Enter diagnosis..."
						disabled={isCompleted}
					/>
					<TextField
						fullWidth
						label="Recommendations"
						name="recommendations"
						value={formData.recommendations}
						onChange={handleChange}
						multiline
						rows={4}
						margin="normal"
						placeholder="Enter recommendations for the patient..."
						disabled={isCompleted}
					/>
					<Box
						sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}
					>
						<Tooltip title="Go back">
							<Button
								variant="outlined"
								onClick={() =>
									navigate(PATHS.DOCTORS_MY_APPOINTMENTS, {
										state: { selectedDate },
									})
								}
								disabled={saving}
							>
								{isCompleted ? "Back" : "Cancel"}
							</Button>
						</Tooltip>
						{!isCompleted && (
							<>
								<Tooltip title="Save changes">
									<Button
										variant="contained"
										color="primary"
										startIcon={
											saving ? <CircularProgress size={20} /> : <CheckCircleIcon />
										}
										onClick={handleSave}
										disabled={saving}
									>
										{saving ? "Saving..." : "Save"}
									</Button>
								</Tooltip>
								<Tooltip title="Save and mark as complete">
									<Button
										variant="contained"
										color="success"
										startIcon={
											saving ? <CircularProgress size={20} /> : <CheckCircleIcon />
										}
										onClick={handleSaveAndComplete}
										disabled={saving}
									>
										{saving ? "Saving..." : "Save & Complete"}
									</Button>
								</Tooltip>
							</>
						)}
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}
