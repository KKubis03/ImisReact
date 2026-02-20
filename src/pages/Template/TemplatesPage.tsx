import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	InputAdornment,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	TemplateService,
	type Template,
} from "../../api/services/template.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import { PATHS } from "../../routes/paths";
import type { SelectListItem } from "../../api/types/pagination";

export default function TemplatesPage() {
	const navigate = useNavigate();
	const [templates, setTemplates] = useState<Template[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [templateTypes, setTemplateTypes] = useState<SelectListItem[]>([]);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
		null,
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
	const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
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
	} = useDataTable<{ type: "DOCUMENT" | "CMS" | "" }>({
		initialFilters: { type: "" },
	});
	useEffect(() => {
		loadTemplateTypes();
	}, []);
	useEffect(() => {
		loadTemplates();
	}, [queryParams]);
	const loadTemplateTypes = async () => {
		try {
			const response = await TemplateService.getTemplateTypesSelectList();
			setTemplateTypes(response || []);
		} catch (err) {
			setError("Failed to load template type options");
		}
	};
	const loadTemplates = async () => {
		try {
			setLoading(true);
			const response = await TemplateService.getAll(queryParams);
			setTemplates(response.items || []);
			setTotalCount(response.totalCount || 0);
			setError("");
		} catch (err) {
			setError("Failed to load document templates");
			setTemplates([]);
			setTotalCount(0);
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!selectedTemplate) return;
		try {
			setIsDeleting(true);
			await TemplateService.delete(selectedTemplate.id);
			if (templates.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadTemplates();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete document template");
		} finally {
			setIsDeleting(false);
			setSelectedTemplate(null);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		template: Template,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedTemplate(template);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handlePreviewClose = () => {
		setPreviewDialogOpen(false);
		setPreviewTemplate(null);
	};
	const templateColumns: Column<Template>[] = [
		{ id: "name", label: "Name", sortable: true },
		{ id: "code", label: "Code", sortable: true },
		{ id: "type", label: "Type", sortable: false },
		{ id: "description", label: "Description", sortable: true },
	];
	const templateActions: MenuAction<Template>[] = [
		{
			label: "Preview Template",
			icon: (
				<VisibilityIcon
					fontSize="small"
					color="info"
				/>
			),
			onClick: (item) => {
				setPreviewTemplate(item);
				setPreviewDialogOpen(true);
			},
		},
		{
			label: "Edit Template",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.DOCS_TEMPLATES_EDIT(item.id)),
		},
		{
			label: "Delete Template",
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
			title="Templates"
			description="Manage document templates."
			addButtonText="New Template"
			addButtonTooltip="Create new Document Template"
			addButtonPath={PATHS.DOCS_TEMPLATES_ADD}
			isLoading={loading}
			error={error}
			data={templates}
			columns={templateColumns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<>
					<TextField
						fullWidth
						size="small"
						label="Search"
						placeholder="Name, code, description"
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
						<InputLabel>Type</InputLabel>
						<Select
							value={filters.type ?? ""}
							onChange={(e) =>
								updateFilter("type", e.target.value as "DOCUMENT" | "CMS" | "")
							}
							label="Type"
						>
							<MenuItem value="">All</MenuItem>
							{templateTypes.map((templateType) => (
								<MenuItem
									key={templateType.id}
									value={templateType.displayName}
								>
									{templateType.displayName}
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
				selectedItem: selectedTemplate,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions: templateActions,
			}}
			dialogs={
				<>
					<Dialog
						open={previewDialogOpen}
						onClose={handlePreviewClose}
						maxWidth="md"
						fullWidth
					>
						<DialogTitle>{previewTemplate?.name} - Preview</DialogTitle>
						<DialogContent>
							<Box
								sx={{
									border: 1,
									borderColor: "grey.300",
									borderRadius: 1,
									p: 2,
									minHeight: 200,
									bgcolor: "background.paper",
								}}
								dangerouslySetInnerHTML={{
									__html: previewTemplate?.htmlContent || "",
								}}
							/>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={handlePreviewClose}
								color="primary"
							>
								Close
							</Button>
						</DialogActions>
					</Dialog>
					<ConfirmDialog
						open={deleteDialogOpen}
						onConfirm={handleDeleteConfirm}
						onClose={() => {
							setDeleteDialogOpen(false);
							setSelectedTemplate(null);
						}}
						loading={isDeleting}
						title="Confirm Delete"
						description="Are you sure you want to delete this document template? This action cannot be undone."
						cancelButtonText="Back"
					/>
				</>
			}
		/>
	);
}
