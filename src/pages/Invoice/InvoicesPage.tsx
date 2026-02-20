import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Chip,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Slider,
	TextField,
	Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentIcon from "@mui/icons-material/Payment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import { InvoiceService } from "../../api/services/invoice.service";
import type { Invoice } from "../../api/services/invoice.service";
import { InvoiceStatusesService } from "../../api/services/invoiceStatus.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { PATHS } from "../../routes/paths";
import { useAuth } from "../../contexts/AuthContext";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import type { SelectListItem } from "../../api/types/pagination";

export default function InvoicesPage() {
	const navigate = useNavigate();
	const { hasRole } = useAuth();
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [statuses, setStatuses] = useState<SelectListItem[]>([]);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [totalGrossRange, setTotalGrossRange] = useState<[number, number]>([
		0, 10000,
	]);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
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
		statusId: number | "";
		issueDate: string;
		dueDate: string;
		totalGrossMin: number | "";
		totalGrossMax: number | "";
	}>({
		initialFilters: {
			statusId: "",
			issueDate: "",
			dueDate: "",
			totalGrossMin: "",
			totalGrossMax: "",
		},
	});
	useEffect(() => {
		if (filtersExpanded) {
			loadFilterOptions();
		}
	}, [filtersExpanded]);
	useEffect(() => {
		loadInvoices();
	}, [queryParams]);
	const loadFilterOptions = async () => {
		try {
			const statusesRes = await InvoiceStatusesService.getAll();
			const mappedStatuses = statusesRes.items.map((s) => ({
				id: s.id,
				displayName: s.statusName,
			}));
			setStatuses(mappedStatuses);
		} catch (err) {
			setError("Failed to load filter options");
		}
	};
	const loadInvoices = async () => {
		try {
			setLoading(true);
			const response = await InvoiceService.getAll(queryParams);
			setInvoices(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load invoices");
		} finally {
			setLoading(false);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		invoice: Invoice,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedInvoice(invoice);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handlePayInvoice = async (invoiceId: number) => {
		handleMenuClose();
		try {
			await InvoiceService.payInvoice(invoiceId);
			loadInvoices();
		} catch (err) {
			setError("Failed to mark invoice as paid");
		}
	};
	const handleIssueInvoice = async (invoiceId: number) => {
		handleMenuClose();
		try {
			await InvoiceService.issueInvoice(invoiceId);
			loadInvoices();
		} catch (err) {
			setError("Failed to issue invoice");
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedInvoice) return;
		try {
			setIsDeleting(true);
			await InvoiceService.delete(selectedInvoice.id);
			if (invoices.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadInvoices();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete invoice");
		} finally {
			setIsDeleting(false);
			setSelectedInvoice(null);
		}
	};
	const handleTotalGrossRangeChange = (
		_event: Event,
		newValue: number | number[],
	) => {
		const range = newValue as [number, number];
		setTotalGrossRange(range);
		updateFilter("totalGrossMin", range[0] > 0 ? range[0] : "");
		updateFilter("totalGrossMax", range[1] < 10000 ? range[1] : "");
	};
	const handleClearFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
		clearAllFilters(event);
		setTotalGrossRange([0, 10000]);
	};
	const invoiceColumns: Column<Invoice>[] = [
		{ id: "invoiceNumber", label: "Invoice Number", sortable: true },
		{
			id: "issueDate",
			label: "Issue Date",
			sortable: true,
			render: (row) => new Date(row.issueDate).toLocaleDateString(),
		},
		{
			id: "dueDate",
			label: "Due Date",
			sortable: true,
			render: (row) => new Date(row.dueDate).toLocaleDateString(),
		},
		{
			id: "statusName",
			label: "Status",
			render: (row) => (
				<Chip
					size="small"
					color="primary"
					label={row.statusName}
				/>
			),
		},
		{
			id: "totalGross",
			label: "Total Gross",
			sortable: true,
			render: (row) => `${row.totalGross.toFixed(2)} ${row.currency}`,
		},
	];
	const invoiceActions: MenuAction<Invoice>[] = [
		{
			label: "View Details",
			icon: (
				<VisibilityIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.INVOICES_DETAILS(item.id)),
		},
		{
			label: "Pay Invoice",
			icon: (
				<PaymentIcon
					fontSize="small"
					color="success"
				/>
			),
			onClick: (item) => handlePayInvoice(item.id),
			show: (item) => item.statusName === "Issued",
		},
		{
			label: "Issue Invoice",
			icon: (
				<PublishIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => handleIssueInvoice(item.id),
			show: (item) => item.statusName === "Draft",
		},
		{
			label: "Delete Invoice",
			icon: (
				<DeleteIcon
					fontSize="small"
					color="error"
				/>
			),
			onClick: () => setDeleteDialogOpen(true),
			show: (item) => item.statusName === "Draft" && hasRole("Admin"),
		},
	];
	return (
		<ListPageWrapper
			title="Invoices"
			description="Manage your clinic invoices."
			addButtonText="New Invoice"
			addButtonTooltip="Create new Invoice"
			addButtonPath={PATHS.INVOICES_ADD}
			isLoading={loading}
			error={error}
			data={invoices}
			columns={invoiceColumns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={handleClearFilters}
			filters={
				<>
					<TextField
						fullWidth
						size="small"
						label="Search"
						placeholder="Invoice Number"
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
						<InputLabel>Status</InputLabel>
						<Select
							value={filters.statusId || ""}
							onChange={(e) => updateFilter("statusId", e.target.value)}
							label="Status"
						>
							<MenuItem value="">All</MenuItem>
							{statuses.map((status) => (
								<MenuItem
									key={status.id}
									value={status.id}
								>
									{status.displayName}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						fullWidth
						size="small"
						label="Issue Date"
						type="date"
						value={filters.issueDate || ""}
						onChange={(e) => updateFilter("issueDate", e.target.value)}
						InputLabelProps={{ shrink: true }}
					/>
					<TextField
						fullWidth
						size="small"
						label="Due Date"
						type="date"
						value={filters.dueDate || ""}
						onChange={(e) => updateFilter("dueDate", e.target.value)}
						InputLabelProps={{ shrink: true }}
					/>
					<Box sx={{ flex: "1 1 100%" }}>
						<Typography gutterBottom>
							Total Gross: {totalGrossRange[0]} - {totalGrossRange[1]} PLN
						</Typography>
						<Slider
							value={totalGrossRange}
							onChange={handleTotalGrossRangeChange}
							valueLabelDisplay="auto"
							min={0}
							max={10000}
							step={100}
						/>
					</Box>
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
				selectedItem: selectedInvoice,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions: invoiceActions,
			}}
			dialogs={
				<ConfirmDialog
					open={deleteDialogOpen}
					onConfirm={handleDeleteConfirm}
					onClose={() => {
						setDeleteDialogOpen(false);
						setSelectedInvoice(null);
					}}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this invoice? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
