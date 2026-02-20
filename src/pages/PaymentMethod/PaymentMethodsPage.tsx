import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import { PATHS } from "../../routes/paths";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	PaymentMethodsService,
	type PaymentMethod,
} from "../../api/services/paymentMethod.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";

export default function PaymentMethodsPage() {
	const navigate = useNavigate();
	const [methods, setMethods] = useState<PaymentMethod[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
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
		loadMethods();
	}, [queryParams]);
	const loadMethods = async () => {
		try {
			setLoading(true);
			const response = await PaymentMethodsService.getAll(queryParams);
			setMethods(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load payment methods");
		} finally {
			setLoading(false);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		method: PaymentMethod,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedMethod(method);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handleDeleteConfirm = async () => {
		if (!selectedMethod) return;
		try {
			setIsDeleting(true);
			await PaymentMethodsService.delete(selectedMethod.id);
			if (methods.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadMethods();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete payment method");
		} finally {
			setIsDeleting(false);
			setSelectedMethod(null);
		}
	};
	const columns: Column<PaymentMethod>[] = [
		{ id: "methodName", label: "Method Name", sortable: true, sortkey: "name" },
		{
			id: "description",
			label: "Description",
			sortable: true,
			sortkey: "description",
		},
	];
	const actions: MenuAction<PaymentMethod>[] = [
		{
			label: "Edit Method",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.PAYMENT_METHODS_EDIT(item.id)),
		},
		{
			label: "Delete Method",
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
			title="Payment Methods"
			description="Manage available payment methods."
			addButtonText="New Method"
			addButtonTooltip="Create new Payment Method"
			addButtonPath={PATHS.PAYMENT_METHODS_ADD}
			isLoading={loading}
			error={error}
			data={methods}
			columns={columns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<TextField
					fullWidth
					size="small"
					label="Search"
					placeholder="Method Name"
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
				selectedItem: selectedMethod,
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
						setSelectedMethod(null);
					}}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this payment method? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
