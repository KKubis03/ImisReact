export interface Column<T> {
	id: string;
	label: string;
	sortable?: boolean;
	sortkey?: string;
	align?: "left" | "right" | "center";
	render?: (row: T) => React.ReactNode;
}
