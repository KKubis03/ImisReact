import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Container,
	Box,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Button,
	Divider,
	Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import {
	AppointmentsService,
	type AppointmentWithDetails,
} from "../../api/services/appointments.service";
import { useAuth } from "../../contexts/AuthContext";
import { PATHS } from "../../routes/paths";

export default function AppointmentDetailsPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { user, hasRole } = useAuth();
	const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [downloadError, setDownloadError] = useState("");
	const [downloadingPdf, setDownloadingPdf] = useState(false);
	useEffect(() => {
		loadDetails();
	}, [id]);
	const loadDetails = async () => {
		if (!id) return;
		try {
			setLoading(true);
			setError("");
			const response = await AppointmentsService.getWithDetails(Number(id));
			const isAdminOrDoctor =
				user?.roles.includes("Admin") || user?.roles.includes("Doctor");
			const isOwnerPatient =
				user?.roles.includes("Patient") &&
				response.patient.id === user.patientId;
			if (!isAdminOrDoctor && !isOwnerPatient) {
				navigate("/unauthorized");
				return;
			}
			setAppointment(response);
		} catch (err: any) {
			if (err?.response?.status === 404) {
				setError("Appointment not found");
			} else {
				setError("Failed to load appointment details");
			}
		} finally {
			setLoading(false);
		}
	};
	const handleCreateInvoice = (appointmentId: number) => {
		navigate(PATHS.INVOICES_ADD, {
			state: { appointmentId },
		});
	};
	const handleDownloadPdf = async () => {
		if (!id) return;
		setDownloadError("");
		setDownloadingPdf(true);
		try {
			const fileName = `AppointmentReport_${id}`;
			await AppointmentsService.downloadPdf(Number(id), fileName);
		} catch (err: any) {
			setDownloadError("Failed to download PDF: " + err.message);
		} finally {
			setDownloadingPdf(false);
		}
	};
	if (loading) {
		return (
			<Container
				maxWidth="md"
				sx={{ mt: 10, mb: 6 }}
			>
				<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}
	if (error) {
		return (
			<Container
				maxWidth="md"
				sx={{ mt: 10, mb: 6 }}
			>
				<Alert
					severity="error"
					sx={{ mb: 2 }}
				>
					{error}
				</Alert>
				<Tooltip title="Go back">
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => navigate(-1)}
					>
						Back
					</Button>
				</Tooltip>
			</Container>
		);
	}
	if (!appointment) {
		return null;
	}
	const hasDetails =
		appointment.details &&
		(appointment.details.notes ||
			appointment.details.diagnosis ||
			appointment.details.recommendations);
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("pl-PL", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};
	const formatDateOfBirth = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("pl-PL");
	};
	return (
		<Container
			maxWidth="lg"
			sx={{ mt: 10, mb: 6 }}
		>
			{downloadError && (
				<Alert
					severity="error"
					sx={{ mb: 3 }}
					onClose={() => setDownloadError("")}
				>
					{downloadError}
				</Alert>
			)}
			<Box sx={{ mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						mb: 2,
					}}
				>
					<Box>
						<Typography
							variant="h3"
							color="primary"
							gutterBottom
						>
							Appointment Details
						</Typography>
					</Box>
					<Box sx={{ display: "flex", gap: 2 }}>
						<Tooltip title="Back">
							<Button
								variant="contained"
								onClick={() => navigate(-1)}
							>
								Back
							</Button>
						</Tooltip>
					</Box>
				</Box>
			</Box>
			{}
			<Box sx={{ display: "flex", gap: 3, mb: 3 }}>
				{}
				<Paper sx={{ p: 4, flex: 1 }}>
					<Typography
						variant="h5"
						color="primary"
						gutterBottom
					>
						Appointment Information
					</Typography>
					<Divider sx={{ mb: 3 }} />
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								Date & Time:
							</Typography>
							<Typography variant="body1">
								{formatDate(appointment.appointmentDate)}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								Type:
							</Typography>
							<Typography variant="body1">
								{appointment.appointmentTypeName}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								Status:
							</Typography>
							<Typography variant="body1">
								{appointment.appointmentStatusName}
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								gap: 1,
								alignItems: "center",
							}}
						>
							{appointment.invoiceId
								? user?.roles?.some((role) =>
										["Admin", "Manager", "Receptionist"].includes(role),
									) && (
										<Tooltip title="View invoice">
											<Button
												variant="outlined"
												size="small"
												onClick={() =>
													navigate(
														PATHS.INVOICES_DETAILS(appointment.invoiceId ?? 0),
													)
												}
											>
												View Invoice
											</Button>
										</Tooltip>
									)
								: user?.roles?.some((role) =>
										["Admin", "Manager", "Receptionist"].includes(role),
									) &&
									appointment.appointmentStatusName === "Completed" && (
										<Tooltip title="Create new invoice for this appointment">
											<Button
												variant="outlined"
												color="primary"
												size="small"
												onClick={() => handleCreateInvoice(appointment.id)}
											>
												Create Invoice
											</Button>
										</Tooltip>
									)}
						</Box>
					</Box>
				</Paper>
				{}
				<Paper sx={{ p: 4, flex: 1 }}>
					<Typography
						variant="h5"
						color="primary"
						gutterBottom
					>
						Patient Information
					</Typography>
					<Divider sx={{ mb: 3 }} />
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								Name:
							</Typography>
							<Typography variant="body1">
								{appointment.patient.firstName} {appointment.patient.lastName}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								PESEL:
							</Typography>
							<Typography variant="body1">
								{appointment.patient.pesel}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								Date of Birth:
							</Typography>
							<Typography variant="body1">
								{formatDateOfBirth(appointment.patient.dateOfBirth)}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								Gender:
							</Typography>
							<Typography variant="body1">
								{appointment.patient.gender}
							</Typography>
						</Box>
					</Box>
				</Paper>
				{}
				<Paper sx={{ p: 4, flex: 1 }}>
					<Typography
						variant="h5"
						color="primary"
						gutterBottom
					>
						Doctor Information
					</Typography>
					<Divider sx={{ mb: 3 }} />
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								Name:
							</Typography>
							<Typography variant="body1">
								{appointment.doctor.firstName} {appointment.doctor.lastName}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								License Number:
							</Typography>
							<Typography variant="body1">
								{appointment.doctor.licenseNumber}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								Specialization:
							</Typography>
							<Typography variant="body1">
								{appointment.doctor.specializationName}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
							<Typography
								variant="body1"
								color="text.secondary"
							>
								Department:
							</Typography>
							<Typography variant="body1">
								{appointment.doctor.departmentName}
							</Typography>
						</Box>
					</Box>
				</Paper>
			</Box>
			{}
			<Paper sx={{ p: 4 }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						mb: 3,
					}}
				>
					<Typography
						variant="h5"
						color="primary"
					>
						Medical Information
					</Typography>
					{user?.roles?.includes("Admin") &&
						appointment.appointmentStatusName !== "Completed" && (
							<Tooltip title={hasDetails ? "Edit details" : "Add details"}>
								<Button
									variant="outlined"
									color="primary"
									startIcon={hasDetails ? <EditIcon /> : <AddIcon />}
									onClick={() =>
										navigate(PATHS.APPOINTMENTS_DETAILS_EDIT(Number(id)))
									}
								>
									{hasDetails ? "Edit" : "Add Details"}
								</Button>
							</Tooltip>
						)}
					{appointment.appointmentStatusName === "Completed" &&
						(hasRole("Admin") ||
							hasRole("Receptionist") ||
							hasRole("Manager")) && (
							<Tooltip title="Download PDF">
								<Button
									variant="outlined"
									startIcon={
										downloadingPdf ? (
											<CircularProgress
												size={20}
												color="inherit"
											/>
										) : (
											<DownloadIcon />
										)
									}
									onClick={handleDownloadPdf}
									disabled={downloadingPdf}
								>
									{downloadingPdf ? "Downloading..." : "Generate PDF"}
								</Button>
							</Tooltip>
						)}
				</Box>
				<Divider sx={{ mb: 3 }} />
				{hasDetails ? (
					<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
						{appointment.details?.notes && (
							<Box>
								<Typography
									variant="h6"
									color="text.secondary"
									gutterBottom
								>
									Notes
								</Typography>
								<Typography variant="body1">
									{appointment.details.notes}
								</Typography>
							</Box>
						)}
						{appointment.details?.diagnosis && (
							<Box>
								<Typography
									variant="h6"
									color="text.secondary"
									gutterBottom
								>
									Diagnosis
								</Typography>
								<Typography variant="body1">
									{appointment.details.diagnosis}
								</Typography>
							</Box>
						)}
						{appointment.details?.recommendations && (
							<Box>
								<Typography
									variant="h6"
									color="text.secondary"
									gutterBottom
								>
									Recommendations
								</Typography>
								<Typography variant="body1">
									{appointment.details.recommendations}
								</Typography>
							</Box>
						)}
					</Box>
				) : (
					<Alert severity="info">
						No medical details have been recorded for this appointment yet.
						{user?.roles?.includes("Admin") &&
							" Click 'Add Details' to create them."}
					</Alert>
				)}
			</Paper>
		</Container>
	);
}
