import { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { RolesService, type Role } from "../../api/services/roles.service";
import { useDataTable } from "../../hooks/useDataTable";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import type { Column } from "../../interfaces/TableColumnInterface";
import { PATHS } from "../../routes/paths";

export default function RolesPage() {
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const {
		page,
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
		loadRoles();
	}, [queryParams]);
	const loadRoles = async () => {
		try {
			setLoading(true);
			const response = await RolesService.getAll(queryParams);
			setRoles(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load roles");
		} finally {
			setLoading(false);
		}
	};
	const columns: Column<Role>[] = [
		{
			id: "name",
			label: "Role Name",
			sortable: true,
		},
		{
			id: "normalizedName",
			label: "Normalized Name",
			sortable: false,
		},
	];
	return (
		<ListPageWrapper
			title="Roles"
			description="Manage roles in the system."
			addButtonText="New Role"
			addButtonTooltip="Create new Role"
			addButtonPath={PATHS.ROLES_ADD}
			isLoading={loading}
			error={error}
			data={roles}
			columns={columns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={clearAllFilters}
			filters={
				<TextField
					fullWidth
					size="small"
					label="Search"
					placeholder="Role name"
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
		/>
	);
}
