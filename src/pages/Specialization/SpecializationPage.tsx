import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import { PATHS } from "../../routes/paths";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	SpecializationsService,
	type Specialization,
} from "../../api/services/specializations.service";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function SpecializationPage() {
	const navigate = useNavigate();
	const [specializations, setSpecializations] = useState<Specialization[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedSpecialization, setSelectedSpecialization] =
		useState<Specialization | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
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
		loadSpecializations();
	}, [queryParams]);
	const loadSpecializations = async () => {
		try {
			setLoading(true);
			const response = await SpecializationsService.getAll(queryParams);
			setSpecializations(response.items || []);
			setTotalCount(response.totalCount || 0);
			setError("");
		} catch (err) {
			setError("Failed to load specializations");
			setSpecializations([]);
			setTotalCount(0);
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedSpecialization) return;
		try {
			setIsDeleting(true);
			await SpecializationsService.delete(selectedSpecialization.id);
			if (specializations.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadSpecializations();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete specialization");
		} finally {
			setIsDeleting(false);
			setSelectedSpecialization(null);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		specialization: Specialization,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedSpecialization(specialization);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const columns: Column<Specialization>[] = [
		{
			id: "name",
			label: "Name",
			sortable: true,
			sortkey: "name",
		},
		{
			id: "description",
			label: "Description",
			sortable: false,
		},
	];
	const menuActions: MenuAction<Specialization>[] = [
		{
			label: "Edit Specialization",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (specialization) =>
				navigate(PATHS.SPECIALIZATIONS_EDIT(specialization.id)),
		},
		{
			label: "Delete Specialization",
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
			title="Specializations"
			description="Below is a list of all specializations in the system."
			addButtonText="New Specialization"
			addButtonTooltip="Create new Specialization"
			addButtonPath={PATHS.SPECIALIZATIONS_ADD}
			isLoading={loading}
			error={error}
			data={specializations}
			columns={columns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<TextField
					fullWidth
					size="small"
					label="Search"
					placeholder="Search specializations by Name"
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
				selectedItem: selectedSpecialization,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions,
			}}
			dialogs={
				<ConfirmDialog
					open={deleteDialogOpen}
					onClose={() => {
						setDeleteDialogOpen(false);
						setSelectedSpecialization(null);
					}}
					onConfirm={handleDeleteConfirm}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this specialization? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
