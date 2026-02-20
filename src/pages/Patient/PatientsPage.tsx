import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	TextField,
	InputAdornment,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import {
	PatientsService,
	type Patient,
} from "../../api/services/patients.service";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useDataTable } from "../../hooks/useDataTable";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import { PATHS } from "../../routes/paths";
import { useAuth } from "../../contexts/AuthContext";

export default function PatientsPage() {
	const navigate = useNavigate();
	const { hasRole } = useAuth();
	const [patients, setPatients] = useState<Patient[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
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
		filters,
		queryParams,
		handlePageChange,
		handleRowsPerPageChange,
		handleSortRequest,
		handleSearchChange,
		updateFilter,
		clearAllFilters,
	} = useDataTable<{
		gender: string;
	}>();
	useEffect(() => {
		loadPatients();
	}, [queryParams]);
	const loadPatients = async () => {
		try {
			setLoading(true);
			const response = await PatientsService.getAll(queryParams);
			setPatients(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load patients");
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedPatient) return;
		try {
			setIsDeleting(true);
			await PatientsService.delete(selectedPatient.id);
			if (patients.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadPatients();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete patient");
		} finally {
			setIsDeleting(false);
			setSelectedPatient(null);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		patient: Patient,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedPatient(patient);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const columns: Column<Patient>[] = [
		{
			id: "firstName",
			label: "First Name",
			sortable: true,
		},
		{
			id: "lastName",
			label: "Last Name",
			sortable: true,
		},
		{
			id: "pesel",
			label: "PESEL",
			sortable: false,
		},
		{
			id: "dateOfBirth",
			label: "Date of Birth",
			sortable: true,
		},
		{
			id: "gender",
			label: "Gender",
			sortable: false,
		},
		{
			id: "email",
			label: "Email",
			sortable: false,
		},
		{
			id: "phoneNumber",
			label: "Phone Number",
			sortable: false,
		},
	];
	const menuActions: MenuAction<Patient>[] = [
		{
			label: "View Profile",
			icon: (
				<PersonIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (patient) => navigate(PATHS.PATIENTS_PROFILE(patient.id)),
			show: () => hasRole("Admin") || hasRole("Receptionist") || hasRole("Doctor"),
		},
		{
			label: "Edit Patient",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (patient) => navigate(PATHS.PATIENTS_EDIT(patient.id)),
			show: () => hasRole("Admin"),
		},
		{
			label: "Delete Patient",
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
			title="Patients"
			description="Manage patient records in the system."
			addButtonTooltip="Create new Patient"
			addButtonText="New Patient"
			addButtonPath={PATHS.PATIENTS_ADD}
			isLoading={loading}
			error={error}
			data={patients}
			columns={columns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<>
					<TextField
						fullWidth
						size="small"
						label="Search"
						placeholder="Name, Surname or PESEL"
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
						<InputLabel>Gender</InputLabel>
						<Select
							value={filters.gender || ""}
							onChange={(e) => updateFilter("gender", e.target.value)}
							label="Gender"
						>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="Male">Male</MenuItem>
							<MenuItem value="Female">Female</MenuItem>
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
				selectedItem: selectedPatient,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions,
			}}
			dialogs={
				<ConfirmDialog
					open={deleteDialogOpen}
					onConfirm={handleDeleteConfirm}
					onClose={() => {
						setDeleteDialogOpen(false);
						setSelectedPatient(null);
					}}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this patient? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
