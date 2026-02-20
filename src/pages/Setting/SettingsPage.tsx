import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import { PATHS } from "../../routes/paths";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	SettingsService,
	type Setting,
} from "../../api/services/settings.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";

export default function SettingsPage() {
	const navigate = useNavigate();
	const [settings, setSettings] = useState<Setting[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
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
		loadSettings();
	}, [queryParams]);
	const loadSettings = async () => {
		try {
			setLoading(true);
			const response = await SettingsService.getAll(queryParams);
			setSettings(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load settings");
		} finally {
			setLoading(false);
		}
	};
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		setting: Setting,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedSetting(setting);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handleDeleteConfirm = async () => {
		if (!selectedSetting) return;
		try {
			setIsDeleting(true);
			await SettingsService.delete(selectedSetting.id);
			if (settings.length === 1 && page > 0) {
				setPage((prev) => prev - 1);
			} else {
				loadSettings();
			}
			setDeleteDialogOpen(false);
		} catch (err) {
			setError("Failed to delete setting");
		} finally {
			setIsDeleting(false);
			setSelectedSetting(null);
		}
	};
	const columns: Column<Setting>[] = [
		{ id: "settingKey", label: "Setting Key", sortable: true },
		{
			id: "settingValue",
			label: "Setting Value",
			sortable: true,
		},
		{
			id: "description",
			label: "Description",
			sortable: true,
			sortkey: "description",
		},
	];
	const actions: MenuAction<Setting>[] = [
		{
			label: "Edit Setting",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (item) => navigate(PATHS.SETTINGS_EDIT(item.id)),
		},
		{
			label: "Delete Setting",
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
			title="General Settings"
			description="Manage system settings."
			addButtonText="Add Setting"
			addButtonPath={PATHS.SETTINGS_ADD}
			addButtonTooltip="Create new setting"
			isLoading={loading}
			error={error}
			data={settings}
			columns={columns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<TextField
					fullWidth
					size="small"
					label="Search"
					placeholder="Search settings..."
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
				selectedItem: selectedSetting,
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
						setSelectedSetting(null);
					}}
					loading={isDeleting}
					title="Confirm Delete"
					description="Are you sure you want to delete this setting? This action cannot be undone."
					cancelButtonText="Back"
				/>
			}
		/>
	);
}
