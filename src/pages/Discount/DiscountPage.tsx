import { useEffect, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	DiscountsService,
	type Discount,
} from "../../api/services/discounts.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import { PATHS } from "../../routes/paths";

export default function DiscountPage() {
	const [discounts, setDiscounts] = useState<Discount[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
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
	} = useDataTable<Record<string, never>>();
	useEffect(() => {
		loadDiscounts();
	}, [queryParams]);
	const loadDiscounts = async () => {
		try {
			setLoading(true);
			const response = await DiscountsService.getAll(queryParams);
			setDiscounts(response.items || []);
			setTotalCount(response.totalCount || 0);
			setError("");
		} catch (err) {
			setError("Failed to load discounts");
			setDiscounts([]);
			setTotalCount(0);
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedDiscount) return;
		try {
			setIsDeleting(true);
			await DiscountsService.delete(selectedDiscount.id);
			if (discounts.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadDiscounts();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete discount");
		} finally {
			setIsDeleting(false);
			setSelectedDiscount(null);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		discount: Discount,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedDiscount(discount);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const discountColumns: Column<Discount>[] = [
		{ id: "name", label: "Name", sortable: true },
		{
			id: "percentage",
			label: "Percentage",
			sortable: true,
			render: (row) => `${row.percentage}%`,
		},
	];
	const discountActions: MenuAction<Discount>[] = [
		{
			label: "Delete Discount",
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
			title="Discounts"
			description="Manage all discounts in the system."
			addButtonText="New Discount"
			addButtonTooltip="Create new Discount"
			addButtonPath={PATHS.DISCOUNTS_ADD}
			isLoading={loading}
			error={error}
			data={discounts}
			columns={discountColumns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<>
					<TextField
						fullWidth
						size="small"
						label="Search"
						placeholder="Discount name"
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
				selectedItem: selectedDiscount,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions: discountActions,
			}}
			dialogs={
				<ConfirmDialog
					open={deleteDialogOpen}
					onConfirm={handleDeleteConfirm}
					onClose={() => {
						setDeleteDialogOpen(false);
						setSelectedDiscount(null);
					}}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this discount? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
