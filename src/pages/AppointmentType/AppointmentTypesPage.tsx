import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	AppointmentTypesService,
	type AppointmentType,
} from "../../api/services/appointmentType.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import { PATHS } from "../../routes/paths";

export default function AppointmentTypesPage() {
	const navigate = useNavigate();
	const [types, setTypes] = useState<AppointmentType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedType, setSelectedType] = useState<AppointmentType | null>(
		null,
	);
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
		loadTypes();
	}, [queryParams]);
	const loadTypes = async () => {
		try {
			setLoading(true);
			const response = await AppointmentTypesService.getAll(queryParams);
			setTypes(response.items || []);
			setTotalCount(response.totalCount || 0);
			setError("");
		} catch (err) {
			setError("Failed to load appointment types");
			setTypes([]);
			setTotalCount(0);
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedType) return;
		try {
			setIsDeleting(true);
			await AppointmentTypesService.delete(selectedType.id);
			if (types.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadTypes();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete appointment type");
		} finally {
			setIsDeleting(false);
			setSelectedType(null);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		type: AppointmentType,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedType(type);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const typeColumns: Column<AppointmentType>[] = [
		{
			id: "name",
			label: "Name",
			sortable: true,
		},
		{
			id: "description",
			label: "Description",
			sortable: true,
		},
	];
	const typeActions: MenuAction<AppointmentType>[] = [
		{
			label: "Edit Type",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (type) => navigate(PATHS.APPOINTMENT_TYPES_EDIT(type.id)),
		},
		{
			label: "Delete Type",
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
			title="Appointment Types"
			description="Manage your clinic appointment types."
			addButtonText="New Type"
			addButtonTooltip="Create new Appointment Type"
			addButtonPath={PATHS.APPOINTMENT_TYPES_ADD}
			isLoading={loading}
			error={error}
			data={types}
			columns={typeColumns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<>
					<TextField
						fullWidth
						size="small"
						label="Search"
						placeholder="Type Name"
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
				selectedItem: selectedType,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions: typeActions,
			}}
			dialogs={
				<>
					<ConfirmDialog
						open={deleteDialogOpen}
						onConfirm={handleDeleteConfirm}
						onClose={() => {
							setDeleteDialogOpen(false);
							setSelectedType(null);
						}}
						loading={isDeleting}
						title="Confirm Delete"
						description="Are you sure you want to delete this appointment type? This action cannot be undone."
						cancelButtonText="Back"
					/>
				</>
			}
		/>
	);
}
