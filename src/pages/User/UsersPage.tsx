import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Chip,
	TextField,
	InputAdornment,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
	type SelectChangeEvent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
	UsersService,
	type UserSummary,
} from "../../api/services/user.service";
import {
	RolesService,
	type RoleListItem,
} from "../../api/services/roles.service";
import ListPageWrapper from "../../components/table/ListPageWrapper";
import type { Column } from "../../interfaces/TableColumnInterface";
import type { MenuAction } from "../../interfaces/MenuActionInterface";
import { PATHS } from "../../routes/paths";

export default function UsersPage() {
	const navigate = useNavigate();
	const [users, setUsers] = useState<UserSummary[]>([]);
	const [initialLoading, setInitialLoading] = useState(true);
	const [error, setError] = useState("");
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [totalCount, setTotalCount] = useState(0);
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("");
	const [roles, setRoles] = useState<RoleListItem[]>([]);
	const [sortBy, setSortBy] = useState<string>();
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	useEffect(() => {
		loadRoles();
	}, []);
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 100);
		return () => clearTimeout(timer);
	}, [search]);
	useEffect(() => {
		loadUsers();
	}, [page, pageSize, sortBy, sortOrder, debouncedSearch, roleFilter]);
	const loadRoles = async () => {
		try {
			const data = await RolesService.getRolesList();
			setRoles(data);
		} catch (err) {
			console.error("Error loading roles:", err);
		}
	};
	const loadUsers = async () => {
		try {
			const response = await UsersService.getAll({
				search: debouncedSearch || undefined,
				pageNumber: page + 1,
				pageSize,
				sortBy: sortBy || undefined,
				sortOrder: sortBy ? sortOrder : undefined,
				role: roleFilter || undefined,
			});
			setUsers(response.items);
			setTotalCount(response.totalCount);
			setError("");
		} catch (err) {
			setError("Failed to load users");
			console.error(err);
		} finally {
			setInitialLoading(false);
		}
	};
	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setPageSize(parseInt(event.target.value, 10));
		setPage(0);
	};
	const handleSortRequest = (property: string) => {
		const isAsc = sortBy === property && sortOrder === "asc";
		setSortOrder(isAsc ? "desc" : "asc");
		setSortBy(property);
	};
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setPage(0);
	};
	const handleRoleChange = (event: SelectChangeEvent<string>) => {
		setRoleFilter(event.target.value);
		setPage(0);
	};
	const handleClearAll = (_event: React.MouseEvent<HTMLButtonElement>) => {
		setSearch("");
		setRoleFilter("");
		setPage(0);
	};
	const columns: Column<UserSummary>[] = [
		{ id: "email", label: "Email", sortable: true },
		{
			id: "roles",
			label: "Roles",
			render: (user) => (
				<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
					{user.roles?.map((role) => (
						<Chip
							key={role}
							label={role}
							color="primary"
							size="small"
						/>
					))}
				</Box>
			),
		},
	];
	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		user: UserSummary,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedUser(user);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const actions: MenuAction<UserSummary>[] = [
		{
			label: "Edit User",
			icon: (
				<EditIcon
					fontSize="small"
					color="primary"
				/>
			),
			onClick: (user) => navigate(PATHS.USERS_EDIT(user.id)),
		},
	];
	return (
		<ListPageWrapper
			title="Users"
			description="Manage system users."
			addButtonTooltip="Create new User"
			addButtonText="New User"
			addButtonPath={PATHS.USERS_ADD}
			isLoading={initialLoading}
			error={error}
			data={users}
			columns={columns}
			filtersExpanded={filtersExpanded}
			onFiltersExpandedChange={setFiltersExpanded}
			onClearFilters={handleClearAll}
			filters={
				<>
					<TextField
						fullWidth
						size="small"
						label="Search"
						placeholder="Email"
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
						<InputLabel>Role</InputLabel>
						<Select
							value={roleFilter}
							label="Role"
							onChange={handleRoleChange}
						>
							<MenuItem value="">All</MenuItem>
							{roles.map((role) => (
								<MenuItem
									key={role.id}
									value={role.name}
								>
									{role.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</>
			}
			pagination={{
				totalCount,
				page,
				rowsPerPage: pageSize,
				onPageChange: handleChangePage,
				onRowsPerPageChange: handleChangeRowsPerPage,
			}}
			sorting={{ sortBy, sortOrder, onSort: handleSortRequest }}
			actions={{
				anchorEl,
				selectedItem: selectedUser,
				onMenuClose: handleMenuClose,
				onActionClick: handleMenuOpen,
				menuActions: actions,
			}}
		/>
	);
}
