import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Chip,
	MenuItem,
	TextField,
	InputAdornment,
	FormControl,
	InputLabel,
	Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import {
	AppointmentsService,
	type Appointment,
	type AppointmentListItem,
} from "../../api/services/appointments.service";
import { AppointmentStatusesService } from "../../api/services/appointmentStatuses.service";
import { AppointmentTypesService } from "../../api/services/appointmentType.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import type { SelectListItem } from "../../api/types/pagination";
import { PATHS } from "../../routes/paths";
import { useAuth } from "../../contexts/AuthContext";

export default function AppointmentsPage() {
	const navigate = useNavigate();
	const { hasRole } = useAuth();
	const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [statuses, setStatuses] = useState<SelectListItem[]>([]);
	const [types, setTypes] = useState<SelectListItem[]>([]);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedAppointment, setSelectedAppointment] =
		useState<AppointmentListItem | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const {
		page,
		setPage,
		setTotalCount,
		totalCount,
		rowsPerPage,
		sortBy,
		sortOrder,
		search,
		filters,
		queryParams,
		handlePageChange,
		handleRowsPerPageChange,
		handleSortRequest,
		handleSearchChange,
		updateFilter,
		clearAllFilters,
	} = useDataTable<{
		statusId: number | "";
		typeId: number | "";
		date: string;
	}>();
	useEffect(() => {
		if (filtersExpanded) loadFilterOptions();
	}, [filtersExpanded]);
	useEffect(() => {
		loadAppointments();
	}, [queryParams]);
	const loadFilterOptions = async () => {
		try {
			const [statusesRes, typesRes] = await Promise.all([
				AppointmentStatusesService.getSelectList(),
				AppointmentTypesService.getSelectList(),
			]);
			setStatuses(statusesRes);
			setTypes(typesRes);
		} catch (err) {
			setError("Failed to load filter options");
		}
	};
	const loadAppointments = async () => {
		try {
			setLoading(true);
			const response = await AppointmentsService.getAll(queryParams);
			setAppointments(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load appointments");
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedAppointment) return;
		try {
			setIsDeleting(true);
			await AppointmentsService.delete(selectedAppointment.id);
			if (appointments.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadAppointments();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete appointment");
		} finally {
			setIsDeleting(false);
			setSelectedAppointment(null);
		}
	};
	const handleCancelConfirm = async () => {
		if (!selectedAppointment) return;
		try {
			setIsCancelling(true);
			await AppointmentsService.cancel(selectedAppointment.id);
			setCancelDialogOpen(false);
			loadAppointments();
		} catch (err) {
			setError("Failed to cancel appointment");
		} finally {
			setIsCancelling(false);
			setSelectedAppointment(null);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		appointment: AppointmentListItem,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedAppointment(appointment);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const appointmentColumns: Column<Appointment>[] = [
		{ id: "patientFullName", label: "Patient", sortable: true },
		{ id: "doctorFullName", label: "Doctor", sortable: true },
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
		{ id: "appointmentTypeName", label: "Type", sortable: true },
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
	const appointmentActions: MenuAction<AppointmentListItem>[] = [
		{
			label: "View Invoice",
			icon: (
				<ArticleIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.INVOICES_DETAILS(item.invoiceId ?? 0)),
			show: (item) => !!item.invoiceId,
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
		{
			label: "Edit Appointment",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.APPOINTMENTS_EDIT(item.id)),
			show: (item) => item.appointmentStatusName === "Planned",
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
				(hasRole("Admin") || hasRole("Receptionist")),
		},
		{
			label: "Delete Appointment",
			icon: (
				<DeleteIcon
					fontSize="small"
					color="error"
				/>
			),
			onClick: () => setDeleteDialogOpen(true),
			show: () => hasRole("Admin"),
		},
	];
	return (
		<ListPageWrapper
			title="Appointments"
			description="Manage your clinic appointments."
			addButtonText="New Appointment"
			addButtonTooltip="Create new Appointment"
			addButtonPath={PATHS.APPOINTMENTS_ADD}
			isLoading={loading}
			error={error}
			data={appointments}
			columns={appointmentColumns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<>
					<TextField
						fullWidth
						size="small"
						label="Search"
						placeholder="Patient or Doctor"
						value={search}
						onChange={handleSearchChange}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
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
				</>
			}
			pagination={{
				totalCount,
				page,
				rowsPerPage,
				onPageChange: handlePageChange,
				onRowsPerPageChange: handleRowsPerPageChange,
			}}
			sorting={{ sortBy, sortOrder, onSort: handleSortRequest }}
			actions={{
				anchorEl,
				selectedItem: selectedAppointment,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions: appointmentActions,
			}}
			dialogs={
				<>
					<ConfirmDialog
						open={deleteDialogOpen}
						onConfirm={handleDeleteConfirm}
						onClose={() => {
							setDeleteDialogOpen(false);
							setSelectedAppointment(null);
						}}
						loading={isDeleting}
						title="Confirm Delete"
						description="Are you sure you want to delete this appointment? This action cannot be undone."
						cancelButtonText="Back"
					/>
					<ConfirmDialog
						open={cancelDialogOpen}
						onConfirm={handleCancelConfirm}
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
				</>
			}
		/>
	);
}
