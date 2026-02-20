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
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import {
	DoctorsService,
	type DoctorListItem,
} from "../../api/services/doctors.service";
import { DepartmentsService } from "../../api/services/departments.service";
import { SpecializationsService } from "../../api/services/specializations.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import type { SelectListItem } from "../../api/types/pagination";
import { PATHS } from "../../routes/paths";
import { useAuth } from "../../contexts/AuthContext";

export default function DoctorsPage() {
	const navigate = useNavigate();
	const { hasRole } = useAuth();
	const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [departments, setDepartments] = useState<SelectListItem[]>([]);
	const [specializations, setSpecializations] = useState<SelectListItem[]>([]);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedDoctor, setSelectedDoctor] = useState<DoctorListItem | null>(
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
		filters,
		queryParams,
		handlePageChange,
		handleRowsPerPageChange,
		handleSortRequest,
		handleSearchChange,
		updateFilter,
		clearAllFilters,
	} = useDataTable<{
		departmentId: number | "";
		specializationId: number | "";
	}>();
	useEffect(() => {
		if (filtersExpanded) {
			loadFilterOptions();
		}
	}, [filtersExpanded]);
	useEffect(() => {
		loadDoctors();
	}, [queryParams]);
	const loadFilterOptions = async () => {
		try {
			const [specializationsRes, departmentsRes] = await Promise.all([
				SpecializationsService.getSelectList(),
				DepartmentsService.getSelectList(),
			]);
			setSpecializations(specializationsRes);
			setDepartments(departmentsRes);
		} catch (err) {
			setError("Failed to load filter options");
		}
	};
	const loadDoctors = async () => {
		try {
			setLoading(true);
			const response = await DoctorsService.getAll(queryParams);
			setDoctors(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load doctors");
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedDoctor) return;
		try {
			setIsDeleting(true);
			await DoctorsService.delete(selectedDoctor.id);
			if (doctors.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadDoctors();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete doctor");
		} finally {
			setIsDeleting(false);
			setSelectedDoctor(null);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		doctor: DoctorListItem,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedDoctor(doctor);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const columns: Column<DoctorListItem>[] = [
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
			id: "licenseNumber",
			label: "License Number",
			sortable: false,
		},
		{
			id: "specializationName",
			label: "Specialization",
			sortable: true,
		},
		{
			id: "departmentName",
			label: "Department",
			sortable: true,
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
	const menuActions: MenuAction<DoctorListItem>[] = [
		{
			label: "Edit Doctor",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (doctor) => navigate(PATHS.DOCTORS_EDIT(doctor.id)),
			show: () => hasRole("Admin"),
		},
		{
			label: "View Schedule",
			icon: (
				<EventNoteOutlinedIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (doctor) => navigate(PATHS.DOCTORS_SCHEDULE(doctor.id)),
		},
		{
			label: "Delete Doctor",
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
			title="Doctors"
			description="Manage doctor records in the system."
			addButtonText={hasRole("Admin") ? "New Doctor" : ""}
			addButtonTooltip={hasRole("Admin") ? "Create new Doctor" : ""}
			addButtonPath={hasRole("Admin") ? PATHS.DOCTORS_ADD : ""}
			isLoading={loading}
			error={error}
			data={doctors}
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
						placeholder="Name or Surname"
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
						<InputLabel>Specialization</InputLabel>
						<Select
							value={filters.specializationId || ""}
							onChange={(e) => updateFilter("specializationId", e.target.value)}
							label="Specialization"
						>
							<MenuItem value="">All</MenuItem>
							{specializations.map((spec) => (
								<MenuItem
									key={spec.id}
									value={spec.id}
								>
									{spec.displayName}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl
						fullWidth
						size="small"
					>
						<InputLabel>Department</InputLabel>
						<Select
							value={filters.departmentId || ""}
							onChange={(e) => updateFilter("departmentId", e.target.value)}
							label="Department"
						>
							<MenuItem value="">All</MenuItem>
							{departments.map((dept) => (
								<MenuItem
									key={dept.id}
									value={dept.id}
								>
									{dept.displayName}
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
				selectedItem: selectedDoctor,
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
						setSelectedDoctor(null);
					}}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this doctor? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
