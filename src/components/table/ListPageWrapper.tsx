import React, { type ReactNode } from "react";
import { Container, Alert } from "@mui/material";
import Header from "../layout/Header";
import FilterWrapper from "./FilterWrapper";
import DataTable from "./DataTable";
import ActionMenu from "./ActionMenu";

interface ListPageWrapperProps<T> {
	title: string;
	description: string;
	addButtonText: string;
	addButtonTooltip?: string;
	addButtonPath: string;
	filters: ReactNode;
	filtersExpanded: boolean;
	onFiltersExpandedChange: (val: boolean) => void;
	onClearFilters: (e: React.MouseEvent<HTMLButtonElement>) => void;
	columns: any[];
	data: T[];
	isLoading: boolean;
	error?: string;
	pagination: {
		totalCount: number;
		page: number;
		rowsPerPage: number;
		onPageChange: (event: unknown, newPage: number) => void;
		onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	};
	sorting: {
		sortBy?: string;
		sortOrder: "asc" | "desc";
		onSort: (property: string) => void;
	};
	actions?: {
		anchorEl: HTMLElement | null;
		selectedItem: T | null;
		onMenuClose: () => void;
		onActionClick: (event: React.MouseEvent<HTMLElement>, item: T) => void;
		menuActions: any[];
	};
	dialogs?: ReactNode;
}
const ListPageWrapper = <T extends { id: string | number }>({
	title,
	description,
	addButtonText,
	addButtonTooltip,
	addButtonPath,
	filters,
	filtersExpanded,
	onFiltersExpandedChange,
	onClearFilters,
	columns,
	data,
	isLoading,
	error,
	pagination,
	sorting,
	actions,
	dialogs,
}: ListPageWrapperProps<T>) => {
	return (
		<Container
			maxWidth="lg"
			sx={{ mt: 5, mb: 6 }}
		>
			<Header
				title={title}
				description={description}
				ButtonTooltip={addButtonTooltip}
				ButtonText={addButtonText}
				ButtonPath={addButtonPath}
			/>
			{error && (
				<Alert
					severity="error"
					sx={{ mb: 2 }}
				>
					{error}
				</Alert>
			)}
			<FilterWrapper
				expanded={filtersExpanded}
				onExpandedChange={onFiltersExpandedChange}
				onClearAll={onClearFilters}
			>
				{filters}
			</FilterWrapper>
			<DataTable
				columns={columns}
				data={data}
				isLoading={isLoading}
				sortBy={sorting.sortBy}
				sortOrder={sorting.sortOrder}
				onSort={sorting.onSort}
				totalCount={pagination.totalCount}
				page={pagination.page}
				rowsPerPage={pagination.rowsPerPage}
				onPageChange={pagination.onPageChange}
				onRowsPerPageChange={pagination.onRowsPerPageChange}
				onActionClick={actions?.onActionClick}
				menuActions={actions?.menuActions}
			/>
			{actions && (
				<ActionMenu
					anchorEl={actions.anchorEl}
					open={Boolean(actions.anchorEl)}
					onClose={actions.onMenuClose}
					selectedItem={actions.selectedItem}
					actions={actions.menuActions}
				/>
			)}
			{dialogs}
		</Container>
	);
};
export default ListPageWrapper;
