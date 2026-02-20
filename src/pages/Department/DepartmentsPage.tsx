import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	DepartmentsService,
	type Department,
} from "../../api/services/departments.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { PATHS } from "../../routes/paths";

export default function DepartmentsPage() {
	const navigate = useNavigate();
	const [departments, setDepartments] = useState<Department[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedDepartment, setSelectedDepartment] =
		useState<Department | null>(null);
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
	} = useDataTable<Record<string, never>>();
	useEffect(() => {
		loadDepartments();
	}, [queryParams]);
	const loadDepartments = async () => {
		try {
			setLoading(true);
			const response = await DepartmentsService.getAll(queryParams);
			setDepartments(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load departments");
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedDepartment) return;
		try {
			setIsDeleting(true);
			await DepartmentsService.delete(selectedDepartment.id);
			if (departments.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadDepartments();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete department");
		} finally {
			setIsDeleting(false);
			setSelectedDepartment(null);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		department: Department,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedDepartment(department);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const departmentColumns: Column<Department>[] = [
		{ id: "name", label: "Name", sortable: true },
		{ id: "description", label: "Description", sortable: true },
	];
	const departmentActions: MenuAction<Department>[] = [
		{
			label: "Edit Department",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.DEPARTMENTS_EDIT(item.id)),
		},
		{
			label: "Delete Department",
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
			title="Departments"
			description="Manage all departments in the system."
			addButtonText="New Department"
			addButtonTooltip="Create new Department"
			addButtonPath={PATHS.DEPARTMENTS_ADD}
			isLoading={loading}
			error={error}
			data={departments}
			columns={departmentColumns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<>
					<TextField
						fullWidth
						size="small"
						label="Search"
						placeholder="Name"
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
			sorting={{ sortBy, sortOrder, onSort: handleSortRequest }}
			actions={{
				anchorEl,
				selectedItem: selectedDepartment,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions: departmentActions,
			}}
			dialogs={
				<ConfirmDialog
					open={deleteDialogOpen}
					onConfirm={handleDeleteConfirm}
					onClose={() => {
						setDeleteDialogOpen(false);
						setSelectedDepartment(null);
					}}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this department? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
