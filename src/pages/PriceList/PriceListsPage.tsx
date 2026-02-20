import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import { PATHS } from "../../routes/paths";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	PriceListService,
	type PriceListItem,
} from "../../api/services/priceList.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";

export default function PriceListsPage() {
	const navigate = useNavigate();
	const [priceList, setPriceList] = useState<PriceListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedItem, setSelectedItem] = useState<PriceListItem | null>(null);
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
		loadPriceList();
	}, [queryParams]);
	const loadPriceList = async () => {
		try {
			setLoading(true);
			const response = await PriceListService.getAll(queryParams);
			setPriceList(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load price list");
		} finally {
			setLoading(false);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		item: PriceListItem,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedItem(item);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handleDeleteConfirm = async () => {
		if (!selectedItem) return;
		try {
			setIsDeleting(true);
			await PriceListService.delete(selectedItem.id);
			if (priceList.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadPriceList();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete price list item");
		} finally {
			setIsDeleting(false);
			setSelectedItem(null);
		}
	};
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("pl-PL", {
			style: "currency",
			currency: "PLN",
		}).format(price);
	};
	const columns: Column<PriceListItem>[] = [
		{
			id: "appointmentTypeName",
			label: "Appointment Type",
			sortable: true,
		},
		{
			id: "price",
			label: "Price",
			sortable: true,
			render: (item) => formatPrice(item.price),
		},
	];
	const actions: MenuAction<PriceListItem>[] = [
		{
			label: "Edit Price",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.PRICELISTS_EDIT(item.id)),
		},
		{
			label: "Delete Price",
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
			title="Price List"
			description="Manage appointment prices."
			addButtonText="New Price"
			addButtonTooltip="Create new Price"
			addButtonPath={PATHS.PRICELISTS_ADD}
			isLoading={loading}
			error={error}
			data={priceList}
			columns={columns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<TextField
					fullWidth
					size="small"
					label="Search"
					placeholder="Appointment Type Name"
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
				selectedItem: selectedItem,
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
						setSelectedItem(null);
					}}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this price list item? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
