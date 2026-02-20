import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import { PATHS } from "../../routes/paths";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	InvoiceStatusesService,
	type InvoiceStatus,
} from "../../api/services/invoiceStatus.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";

export default function InvoiceStatusesPage() {
	const navigate = useNavigate();
	const [statuses, setStatuses] = useState<InvoiceStatus[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | null>(
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
	} = useDataTable<{}>();
	useEffect(() => {
		loadStatuses();
	}, [queryParams]);
	const loadStatuses = async () => {
		try {
			setLoading(true);
			const response = await InvoiceStatusesService.getAll(queryParams);
			setStatuses(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load invoice statuses");
		} finally {
			setLoading(false);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		status: InvoiceStatus,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedStatus(status);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handleDeleteConfirm = async () => {
		if (!selectedStatus) return;
		try {
			setIsDeleting(true);
			await InvoiceStatusesService.delete(selectedStatus.id);
			if (statuses.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadStatuses();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete invoice status");
		} finally {
			setIsDeleting(false);
			setSelectedStatus(null);
		}
	};
	const columns: Column<InvoiceStatus>[] = [
		{ id: "statusName", label: "Status Name", sortable: true, sortkey: "name" },
		{
			id: "description",
			label: "Description",
			sortable: true,
			sortkey: "description",
		},
	];
	const actions: MenuAction<InvoiceStatus>[] = [
		{
			label: "Edit Status",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.INVOICE_STATUSES_EDIT(item.id)),
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
			title="Invoice Statuses"
			description="Manage invoice statuses."
			addButtonTooltip="Create new status"
			addButtonText="New Status"
			addButtonPath={PATHS.INVOICE_STATUSES_ADD}
			isLoading={loading}
			error={error}
			data={statuses}
			columns={columns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
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
				selectedItem: selectedStatus,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions: actions,
			}}
			dialogs={
				<ConfirmDialog
					open={deleteDialogOpen}
					onConfirm={handleDeleteConfirm}
					onClose={() => {
						setDeleteDialogOpen(false);
						setSelectedStatus(null);
					}}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this invoice status? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
