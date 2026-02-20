import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TableSortLabel,
	TablePagination,
	IconButton,
	Skeleton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { Column } from "../../interfaces/TableColumnInterface";

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	sortBy?: string;
	sortOrder: "asc" | "desc";
	onSort: (id: string) => void;
	totalCount: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (event: unknown, newPage: number) => void;
	onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onActionClick?: (event: React.MouseEvent<HTMLElement>, row: T) => void;
	isLoading?: boolean;
	menuActions?: any[];
}

const DataTable = <T extends { id: string | number }>({
	columns,
	data,
	sortBy,
	sortOrder,
	onSort,
	totalCount,
	page,
	rowsPerPage,
	onPageChange,
	onRowsPerPageChange,
	onActionClick,
	isLoading = false,
	menuActions,
}: DataTableProps<T>) => {
	const skeletonRows = Array.from(
		new Array(rowsPerPage > 0 ? rowsPerPage : 10),
	);
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						{columns.map((column) => (
							<TableCell
								key={column.id}
								align={column.align || "left"}
								sortDirection={sortBy === column.id ? sortOrder : false}
							>
								{column.sortable ? (
									<TableSortLabel
										active={sortBy === (column.sortkey || column.id)}
										direction={
											sortBy === (column.sortkey || column.id)
												? sortOrder
												: "asc"
										}
										onClick={() => onSort(column.sortkey || column.id)}
										disabled={isLoading}
									>
										{column.label}
									</TableSortLabel>
								) : (
									column.label
								)}
							</TableCell>
						))}
						{onActionClick && <TableCell align="right">Actions</TableCell>}
					</TableRow>
				</TableHead>
				<TableBody>
					{isLoading
						? skeletonRows.map((_, index) => (
								<TableRow key={`skeleton-${index}`}>
									{columns.map((column) => (
										<TableCell key={`skeleton-cell-${column.id}`}>
											<Skeleton
												variant="text"
												animation="wave"
												height={32}
											/>
										</TableCell>
									))}
									{onActionClick && (
										<TableCell align="right">
											<Skeleton
												variant="circular"
												width={32}
												height={32}
												sx={{ ml: "auto" }}
											/>
										</TableCell>
									)}
								</TableRow>
							))
						: data.map((row) => {
								const hasVisibleActions = menuActions?.some((action) =>
									action.show ? action.show(row) : true,
								);
								return (
									<TableRow
										key={row.id}
										hover
									>
										{columns.map((column) => (
											<TableCell
												key={column.id}
												align={column.align || "left"}
											>
												{column.render
													? column.render(row)
													: (row as any)[column.id]}
											</TableCell>
										))}
										{onActionClick && (
											<TableCell align="right">
												<IconButton
													onClick={(e) => onActionClick(e, row)}
													disabled={!hasVisibleActions}
												>
													<MoreVertIcon />
												</IconButton>
											</TableCell>
										)}
									</TableRow>
								);
							})}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25, 50]}
				component="div"
				count={totalCount}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={onPageChange}
				onRowsPerPageChange={onRowsPerPageChange}
				disabled={isLoading}
			/>
		</TableContainer>
	);
};
export default DataTable;
