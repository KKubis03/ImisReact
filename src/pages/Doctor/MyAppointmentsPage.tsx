import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
	Typography,
	Box,
	Paper,
	Container,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	CircularProgress,
	Alert,
	Chip,
	IconButton,
	Tooltip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "../../contexts/AuthContext";
import {
	AppointmentsService,
	type AppointmentListItem,
} from "../../api/services/appointments.service";
import Header from "../../components/layout/Header";
import { PATHS } from "../../routes/paths";

export default function MyAppointmentsPage() {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();
	const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [downloadError, setDownloadError] = useState("");
	const [downloadingPdfId, setDownloadingPdfId] = useState<number | null>(null);
	const [selectedDate, setSelectedDate] = useState(() => {
		const stateDate = (location.state as any)?.selectedDate;
		return stateDate ? new Date(stateDate) : new Date();
	});
	const [unprocessedCount, setUnprocessedCount] = useState(0);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const handleDownloadPdf = async (id: number, fileName: string) => {
		if (!id) return;
		setDownloadError("");
		setDownloadingPdfId(id);
		try {
			await AppointmentsService.downloadPdf(Number(id), fileName);
		} catch (err: any) {
			setDownloadError("Failed to download PDF: " + err.message);
		} finally {
			setDownloadingPdfId(null);
		}
	};
	useEffect(() => {
		const loadInitialData = async () => {
			if (!user?.doctorId || initialLoadComplete) return;
			try {
				setLoading(true);
				const response = await AppointmentsService.getUnprocessed(
					user.doctorId,
				);
				const { numberOfUnprocessedAppointments, unprocessedAppointments } =
					response;
				setUnprocessedCount(numberOfUnprocessedAppointments);
				if (unprocessedAppointments.length > 0) {
					const oldestUnprocessed = unprocessedAppointments[0];
					setSelectedDate(new Date(oldestUnprocessed.appointmentDate));
				}
				setInitialLoadComplete(true);
			} catch (err) {
				console.error("Failed to load initial data", err);
				setInitialLoadComplete(true);
			} finally {
				setLoading(false);
			}
		};
		loadInitialData();
	}, [user]);
	useEffect(() => {
		if (initialLoadComplete) {
			loadAppointments();
		}
	}, [user, selectedDate, initialLoadComplete]);
	const loadAppointments = async () => {
		if (!user?.doctorId) {
			setError("Doctor ID not found for logged in user");
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const formattedDate = formatDateForApi(selectedDate);
			const response = await AppointmentsService.getAllByDoctorId(
				user.doctorId,
				formattedDate,
			);
			setAppointments(response);
			setError("");
		} catch (err) {
			setError("Failed to load appointments");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const formatDateForApi = (date: Date) => {
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${month}.${day}.${year}`;
	};
	const formatDateDisplay = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};
	const handlePreviousDay = () => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() - 1);
		setSelectedDate(newDate);
	};
	const handleNextDay = () => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() + 1);
		setSelectedDate(newDate);
	};
	const handleToday = () => {
		setSelectedDate(new Date());
	};
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};
	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "planned":
				return "primary";
			case "completed":
				return "success";
			case "in progress":
				return "info";
			case "cancelled":
				return "error";
			case "unprocessed":
				return "warning";
			default:
				return "default";
		}
	};
	const isCompleted = (status: string) => {
		return status.toLowerCase() === "completed";
	};
	const isInProgress = (status: string) => {
		return status.toLowerCase() === "in progress";
	};
	const isPlanned = (status: string) => {
		return status.toLowerCase() === "planned";
	};
	const isUnprocessed = (status: string) => {
		return status.toLowerCase() === "unprocessed";
	};
	const handleExportReport = (appointmentId: number) => {
		handleDownloadPdf(appointmentId, `AppointmentReport_${appointmentId}`);
	};
	if (loading) {
		return (
			<Container
				maxWidth="lg"
				sx={{ py: 4 }}
			>
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}
	return (
		<Container
			maxWidth="lg"
			sx={{ py: 4 }}
		>
			<Header
				title="My Appointments"
				description="Manage your appointments"
			/>
			{unprocessedCount > 0 && (
				<Alert
					severity="warning"
					sx={{ mb: 3 }}
				>
					You have {unprocessedCount} unprocessed appointment
					{unprocessedCount !== 1 ? "s" : ""} waiting for review.
				</Alert>
			)}
			{downloadError && (
				<Alert
					severity="error"
					sx={{ mb: 3 }}
				>
					{downloadError}
				</Alert>
			)}
			<Paper sx={{ p: 2, mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: 2,
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Tooltip title="Previous">
							<IconButton
								onClick={handlePreviousDay}
								color="primary"
								aria-label="previous day"
							>
								<ChevronLeftIcon />
							</IconButton>
						</Tooltip>
						<Typography
							variant="h6"
							sx={{ minWidth: "300px", textAlign: "center" }}
						>
							{formatDateDisplay(selectedDate)}
						</Typography>
						<Tooltip title="Next">
							<IconButton
								onClick={handleNextDay}
								color="primary"
								aria-label="next day"
							>
								<ChevronRightIcon />
							</IconButton>
						</Tooltip>
					</Box>
					<Tooltip title="Go to today">
						<Button
							variant="contained"
							onClick={handleToday}
						>
							Today
						</Button>
					</Tooltip>
				</Box>
			</Paper>
			{error && (
				<Alert
					severity="error"
					sx={{ mb: 3 }}
				>
					{error}
				</Alert>
			)}
			{appointments.length === 0 && !error ? (
				<Paper sx={{ p: 4, textAlign: "center" }}>
					<Typography
						variant="body1"
						color="text.secondary"
					>
						You don't have any appointments yet.
					</Typography>
				</Paper>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									<strong>Time</strong>
								</TableCell>
								<TableCell>
									<strong>Patient</strong>
								</TableCell>
								<TableCell>
									<strong>Appointment Type</strong>
								</TableCell>
								<TableCell>
									<strong>Status</strong>
								</TableCell>
								<TableCell align="right">
									<strong>Actions</strong>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{appointments
								.sort(
									(a, b) =>
										new Date(a.appointmentDate).getTime() -
										new Date(b.appointmentDate).getTime(),
								)
								.map((appointment) => (
									<TableRow key={appointment.id}>
										<TableCell>
											{formatDate(appointment.appointmentDate)}
										</TableCell>
										<TableCell>
											<Link
												to={PATHS.PATIENTS_PROFILE(appointment.patientId ?? "")}
												style={{
													textDecoration: "none",
													color: "inherit",
													fontWeight: 500,
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.textDecoration = "underline";
													e.currentTarget.style.color =
														theme.palette.primary.main;
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.textDecoration = "none";
													e.currentTarget.style.color = "inherit";
												}}
											>
												{appointment.patientFullName}
											</Link>
										</TableCell>
										<TableCell>{appointment.appointmentTypeName}</TableCell>
										<TableCell>
											<Chip
												label={appointment.appointmentStatusName}
												color={getStatusColor(
													appointment.appointmentStatusName,
												)}
												size="small"
												variant="filled"
											/>
										</TableCell>
										<TableCell align="right">
											{isCompleted(appointment.appointmentStatusName) ? (
												<Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
													<Tooltip title="View appointment details">
														<Button
															color="info"
															variant="contained"
															size="small"
															startIcon={<VisibilityIcon />}
															onClick={() =>
																navigate(
																	`${PATHS.DOCTOR.APPOINTMENTS_DETAILS(appointment.id)}`,
																	{
																		state: {
																			selectedDate: selectedDate.toISOString(),
																		},
																	},
																)
															}
														>
															View
														</Button>
													</Tooltip>
													<Tooltip title="Generate PDF Report">
														<Button
															color="success"
															variant="contained"
															size="small"
															startIcon={
																downloadingPdfId === appointment.id ? (
																	<CircularProgress
																		size={20}
																		color="inherit"
																	/>
																) : (
																	<DownloadIcon />
																)
															}
															disabled={downloadingPdfId === appointment.id}
															onClick={() => handleExportReport(appointment.id)}
														>
															{downloadingPdfId === appointment.id
																? "Downloading..."
																: "Generate PDF"}
														</Button>
													</Tooltip>
												</Box>
											) : isInProgress(appointment.appointmentStatusName) ? (
												<Tooltip title="Continue appointment">
													<Button
														color="info"
														variant="contained"
														size="small"
														startIcon={<PlayArrowIcon />}
														onClick={() =>
															navigate(
																`${PATHS.DOCTOR.APPOINTMENTS_DETAILS(appointment.id)}`,
																{
																	state: {
																		selectedDate: selectedDate.toISOString(),
																	},
																},
															)
														}
													>
														Continue
													</Button>
												</Tooltip>
											) : isPlanned(appointment.appointmentStatusName) ? (
												<Tooltip title="Start">
													<Button
														variant="contained"
														color="primary"
														size="small"
														startIcon={<PlayArrowIcon />}
														onClick={() =>
															navigate(
																`${PATHS.DOCTOR.APPOINTMENTS_DETAILS(appointment.id)}`,
																{
																	state: {
																		selectedDate: selectedDate.toISOString(),
																	},
																},
															)
														}
													>
														Start
													</Button>
												</Tooltip>
											) : isUnprocessed(appointment.appointmentStatusName) ? (
												<Tooltip title="Review and start">
													<Button
														variant="contained"
														color="warning"
														size="small"
														startIcon={<PlayArrowIcon />}
														onClick={() =>
															navigate(
																`${PATHS.DOCTOR.APPOINTMENTS_DETAILS(appointment.id)}`,
																{
																	state: {
																		selectedDate: selectedDate.toISOString(),
																	},
																},
															)
														}
													>
														Review
													</Button>
												</Tooltip>
											) : null}
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	);
}
