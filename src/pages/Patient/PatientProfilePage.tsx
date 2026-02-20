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
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Backdrop,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
	PatientsService,
	type Patient,
} from "../../api/services/patients.service";
import { useAuth } from "../../contexts/AuthContext";
import { AppointmentStatusesService } from "../../api/services/appointmentStatuses.service";
import { AppointmentTypesService } from "../../api/services/appointmentType.service";
import { PATHS } from "../../routes/paths";
import { useDataTable } from "../../hooks/useDataTable";
import type { SelectListItem } from "../../api/types/pagination";
import DataTable from "../../components/table/DataTable";
import type { Column } from "../../interfaces/TableColumnInterface";
import {
	AppointmentsService,
	type AppointmentListItem,
} from "../../api/services/appointments.service";
import ActionMenu from "../../components/table/ActionMenu";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { InfoOutline } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import { InvoiceService } from "../../api/services/invoice.service";

export default function PatientProfilePage() {
	const { hasRole } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { user } = useAuth();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
	const [appointmentsLoading, setAppointmentsLoading] = useState(false);
	const [appointmentsError, setAppointmentsError] = useState("");
	const [appointmentMenuAnchorEl, setAppointmentMenuAnchorEl] =
		useState<null | HTMLElement>(null);
	const [selectedAppointment, setSelectedAppointment] =
		useState<AppointmentListItem | null>(null);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [statuses, setStatuses] = useState<SelectListItem[]>([]);
	const [types, setTypes] = useState<SelectListItem[]>([]);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [loadingPDF, setLoadingPDF] = useState(false);
	const {
		page,
		rowsPerPage,
		sortBy,
		sortOrder,
		filters,
		queryParams,
		handlePageChange,
		handleRowsPerPageChange,
		handleSortRequest,
		updateFilter,
		clearAllFilters,
	} = useDataTable<{
		statusId: number | "";
		typeId: number | "";
		date: string;
	}>();
	useEffect(() => {
		loadPatientData();
	}, [id, user]);
	useEffect(() => {
		if (filtersExpanded) loadFilterOptions();
	}, [filtersExpanded]);
	useEffect(() => {
		if (patient) {
			loadAppointments();
		}
	}, [queryParams, patient]);
	const loadPatientData = async () => {
		const patientId = id || (user?.patientId ? String(user.patientId) : null);
		if (!patientId) {
			setError("Invalid patient ID");
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const patientResponse = await PatientsService.getById(
				parseInt(patientId),
			);
			setPatient(patientResponse);
			setError("");
		} catch (err) {
			setError("Failed to load patient data");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const handleDownloadPdf = async (invoiceId: number | undefined) => {
		if (!invoiceId) return;
		setAppointmentsError("");
		setLoadingPDF(true);
		try {
			const fileName = invoiceId ? `invoice_${invoiceId}` : "invoice";
			await InvoiceService.downloadPdf(invoiceId, fileName);
		} catch (err: any) {
			setAppointmentsError(err.message);
		} finally {
			setLoadingPDF(false);
		}
	};
	const loadFilterOptions = async () => {
		try {
			const [statusesRes, typesRes] = await Promise.all([
				AppointmentStatusesService.getSelectList(),
				AppointmentTypesService.getSelectList(),
			]);
			setStatuses(statusesRes);
			setTypes(typesRes);
		} catch (err) {
			setAppointmentsError("Failed to load filter options");
		}
	};
	const loadAppointments = async () => {
		if (!patient) return;
		try {
			setAppointmentsLoading(true);
			const response = await AppointmentsService.getAll({
				...queryParams,
				patientId: patient.id,
			});
			setAppointments(response.items || []);
			setTotalCount(response.totalCount);
			setAppointmentsError("");
		} catch (err) {
			setAppointmentsError("Failed to load appointments");
		} finally {
			setAppointmentsLoading(false);
		}
	};
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};
	const appointmentColumns: Column<AppointmentListItem>[] = [
		{
			id: "date",
			label: "Date",
			sortable: true,
			render: (row) => new Date(row.appointmentDate).toLocaleDateString(),
		},
		{
			id: "time",
			label: "Time",
			render: (row) =>
				new Date(row.appointmentDate).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
		},
		{
			id: "doctorFullName",
			label: "Doctor",
			sortable: true,
		},
		{
			id: "appointmentTypeName",
			label: "Type",
			sortable: true,
		},
		{
			id: "status",
			label: "Status",
			sortable: true,
			render: (row) => (
				<Chip
					size="small"
					color="primary"
					label={row.appointmentStatusName}
				/>
			),
		},
	];
	const handleAppointmentMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		appointment: AppointmentListItem,
	) => {
		setAppointmentMenuAnchorEl(event.currentTarget);
		setSelectedAppointment(appointment);
	};
	const handleAppointmentMenuClose = () => {
		setAppointmentMenuAnchorEl(null);
	};
	const handleCancelAppointmentConfirm = async () => {
		if (!selectedAppointment) return;
		try {
			setIsCancelling(true);
			await AppointmentsService.cancel(selectedAppointment.id);
			setCancelDialogOpen(false);
			await loadAppointments();
		} catch (err) {
			setAppointmentsError("Failed to cancel appointment");
		} finally {
			setIsCancelling(false);
			setSelectedAppointment(null);
		}
	};
	const appointmentActions: MenuAction<AppointmentListItem>[] = [
		{
			label: "View Details",
			icon: (
				<InfoOutline
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.APPOINTMENTS_DETAILS(item.id)),
			show: () =>
				hasRole("Admin") ||
				hasRole("Doctor") ||
				user?.patientId === patient?.id,
		},
		{
			label: "Cancel Appointment",
			icon: (
				<CancelIcon
					fontSize="small"
					color="error"
				/>
			),
			onClick: () => setCancelDialogOpen(true),
			show: (item) =>
				item.appointmentStatusName === "Planned" &&
				(hasRole("Admin") ||
					hasRole("Receptionist") ||
					user?.patientId === patient?.id),
		},
		{
			label: "View Invoice",
			icon: (
				<ArticleIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.INVOICES_DETAILS(item.invoiceId ?? 0)),
			show: (item) =>
				!!item.invoiceId &&
				(hasRole("Admin") || hasRole("Receptionist") || hasRole("Manager")),
		},
		{
			label: "Download Invoice",
			icon: (
				<ArticleIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => handleDownloadPdf(item.invoiceId ?? undefined),
			show: (item) =>
				!!item.invoiceId &&
				hasRole("Patient") &&
				user?.patientId === patient?.id,
		},
		{
			label: "Create Invoice",
			icon: (
				<ArticleIcon
					fontSize="small"
					color="secondary"
				/>
			),
			onClick: (item) =>
				navigate(PATHS.INVOICES_ADD, { state: { appointmentId: item.id } }),
			show: (item) =>
				!item.invoiceId &&
				item.appointmentStatusName === "Completed" &&
				(hasRole("Admin") || hasRole("Receptionist") || hasRole("Manager")),
		},
	];
	if (loading) {
		return (
			<Container
				maxWidth="xl"
				sx={{ mt: 10, mb: 6 }}
			>
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}
	if (!patient) {
		return (
			<Container
				maxWidth="xl"
				sx={{ mt: 10, mb: 6 }}
			>
				<Alert severity="error">Patient not found</Alert>
				<Tooltip title="Go back">
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => navigate(-1)}
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
			maxWidth="lg"
			sx={{ py: 4 }}
		>
			<Box sx={{ mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography
						variant="h3"
						color="primary"
					>
						Patient Profile
					</Typography>
				</Box>
			</Box>
			{error && (
				<Alert
					severity="error"
					sx={{ mb: 3 }}
				>
					{error}
				</Alert>
			)}
			<Paper sx={{ p: 3, mb: 3 }}>
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
						gutterBottom
						color="primary"
					>
						Personal Information
					</Typography>
					{(hasRole("Admin") || user?.patientId === patient.id) && (
						<Tooltip title="Edit details">
							<Button
								variant="contained"
								color="primary"
								startIcon={<EditIcon />}
								onClick={() => navigate(PATHS.PATIENTS_EDIT(patient.id))}
							>
								Edit
							</Button>
						</Tooltip>
					)}
				</Box>
				<Divider sx={{ mb: 3 }} />
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
						gap: 3,
					}}
				>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Full Name
								</Typography>
								<Typography variant="body1">
									{patient.firstName} {patient.lastName}
								</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									PESEL
								</Typography>
								<Typography variant="body1">{patient.pesel}</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Date of Birth
								</Typography>
								<Typography variant="body1">
									{formatDate(patient.dateOfBirth)}
								</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Gender
								</Typography>
								<Typography variant="body1">{patient.gender}</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Email
								</Typography>
								<Typography variant="body1">{patient.email}</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Phone Number
								</Typography>
								<Typography variant="body1">{patient.phoneNumber}</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Paper>
			<Paper sx={{ p: 3, mb: 3 }}>
				<Typography
					variant="h5"
					gutterBottom
					color="primary"
				>
					Patient Appointments
				</Typography>
				<Divider sx={{ mb: 3 }} />
				{appointmentsError && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
					>
						{appointmentsError}
					</Alert>
				)}
				{}
				<Box sx={{ mb: 3 }}>
					<Button
						startIcon={<FilterListIcon />}
						onClick={() => setFiltersExpanded(!filtersExpanded)}
						sx={{ mb: 2 }}
					>
						{filtersExpanded ? "Hide Filters" : "Show Filters"}
					</Button>
					{filtersExpanded && (
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "1fr",
									sm: "1fr 1fr",
									md: "1fr 1fr 1fr 1fr",
								},
								gap: 2,
								mb: 2,
							}}
						>
							<FormControl
								fullWidth
								size="small"
							>
								<InputLabel>Type</InputLabel>
								<Select
									value={filters.typeId || ""}
									onChange={(e) => updateFilter("typeId", e.target.value)}
									label="Type"
								>
									<MenuItem value="">All</MenuItem>
									{types.map((t) => (
										<MenuItem
											key={t.id}
											value={t.id}
										>
											{t.displayName}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<TextField
								fullWidth
								size="small"
								label="Date"
								type="date"
								value={filters.date || ""}
								onChange={(e) => updateFilter("date", e.target.value)}
								InputLabelProps={{ shrink: true }}
							/>
							<FormControl
								fullWidth
								size="small"
							>
								<InputLabel>Status</InputLabel>
								<Select
									value={filters.statusId || ""}
									onChange={(e) => updateFilter("statusId", e.target.value)}
									label="Status"
								>
									<MenuItem value="">All</MenuItem>
									{statuses.map((s) => (
										<MenuItem
											key={s.id}
											value={s.id}
										>
											{s.displayName}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					)}
					{filtersExpanded && (
						<Button
							onClick={clearAllFilters}
							size="small"
							sx={{ mb: 1 }}
						>
							Clear All Filters
						</Button>
					)}
				</Box>
				<DataTable
					columns={appointmentColumns}
					data={appointments}
					sortBy={sortBy}
					sortOrder={sortOrder}
					onSort={handleSortRequest}
					totalCount={totalCount}
					page={page}
					rowsPerPage={rowsPerPage}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleRowsPerPageChange}
					isLoading={appointmentsLoading}
					onActionClick={handleAppointmentMenuOpen}
					menuActions={appointmentActions}
				/>
				<ActionMenu
					anchorEl={appointmentMenuAnchorEl}
					open={Boolean(appointmentMenuAnchorEl)}
					onClose={handleAppointmentMenuClose}
					selectedItem={selectedAppointment}
					actions={appointmentActions}
				/>
				<Backdrop
					sx={(theme) => ({
						color: "#fff",
						zIndex: theme.zIndex.drawer + 1,
						backgroundColor: "rgba(0, 0, 0, 0.3)",
					})}
					open={loadingPDF}
				>
					<Box sx={{ textAlign: "center" }}>
						<CircularProgress color="inherit" />
						<Typography sx={{ mt: 2 }}>Downloading PDF...</Typography>
					</Box>
				</Backdrop>
				<ConfirmDialog
					open={cancelDialogOpen}
					onConfirm={handleCancelAppointmentConfirm}
					onClose={() => {
						setCancelDialogOpen(false);
						setSelectedAppointment(null);
					}}
					loading={isCancelling}
					title="Confirm Cancel"
					description="Are you sure you want to cancel this appointment?"
					confirmButtonText="Cancel Appointment"
					cancelButtonText="Back"
				/>
			</Paper>
		</Container>
	);
}
