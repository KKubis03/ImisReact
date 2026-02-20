import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	AppointmentStatusesService,
	type AppointmentStatus,
} from "../../api/services/appointmentStatuses.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import { PATHS } from "../../routes/paths";

export default function AppointmentStatusesPage() {
	const navigate = useNavigate();
	const [statuses, setStatuses] = useState<AppointmentStatus[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedStatus, setSelectedStatus] =
		useState<AppointmentStatus | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const {
		page,
		setPage,
		setTotalCount,
		totalCount,
		rowsPerPage,
		sortBy,
		sortOrder,
		search,
		queryParams,
		handlePageChange,
		handleRowsPerPageChange,
		handleSortRequest,
		handleSearchChange,
		clearAllFilters,
	} = useDataTable();
	useEffect(() => {
		loadStatuses();
	}, [queryParams]);
	const loadStatuses = async () => {
		try {
			setLoading(true);
			const response = await AppointmentStatusesService.getAll(queryParams);
			setStatuses(response.items || []);
			setTotalCount(response.totalCount || 0);
			setError("");
		} catch (err) {
			setError("Failed to load appointment statuses");
			setStatuses([]);
			setTotalCount(0);
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedStatus) return;
		try {
			setIsDeleting(true);
			await AppointmentStatusesService.delete(selectedStatus.id);
			if (statuses.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadStatuses();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete status");
		} finally {
			setIsDeleting(false);
			setSelectedStatus(null);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		status: AppointmentStatus,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedStatus(status);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const statusColumns: Column<AppointmentStatus>[] = [
		{
			id: "statusName",
			label: "Status Name",
			sortable: true,
			sortkey: "name",
		},
		{
			id: "description",
			label: "Description",
			sortable: true,
		},
	];
	const statusActions: MenuAction<AppointmentStatus>[] = [
		{
			label: "Edit Status",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (status) => navigate(PATHS.APPOINTMENT_STATUSES_EDIT(status.id)),
		},
		{
			label: "Delete Status",
			icon: (
				<DeleteIcon
					fontSize="small"
					color="error"
				/>
			),
			onClick: () => setDeleteDialogOpen(true),
		},
	];
	return (
		<ListPageWrapper
			title="Appointment Statuses"
			description="Manage your clinic appointment statuses."
			addButtonText="New Status"
			addButtonTooltip="Create new Appointment Status"
			addButtonPath={PATHS.APPOINTMENT_STATUSES_ADD}
			isLoading={loading}
			error={error}
			data={statuses}
			columns={statusColumns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<>
					<TextField
						fullWidth
						size="small"
						label="Search"
						placeholder="Status Name"
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
				</>
			}
			pagination={{
				totalCount,
				page,
				rowsPerPage,
				onPageChange: handlePageChange,
				onRowsPerPageChange: handleRowsPerPageChange,
			}}
			sorting={{
				sortBy,
				sortOrder,
				onSort: handleSortRequest,
			}}
			actions={{
				anchorEl,
				selectedItem: selectedStatus,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions: statusActions,
			}}
			dialogs={
				<>
					<ConfirmDialog
						open={deleteDialogOpen}
						onConfirm={handleDeleteConfirm}
						onClose={() => {
							setDeleteDialogOpen(false);
							setSelectedStatus(null);
						}}
						loading={isDeleting}
						title="Confirm Delete"
						description="Are you sure you want to delete this appointment status? This action cannot be undone."
						cancelButtonText="Back"
					/>
				</>
			}
		/>
	);
}
