export interface MenuAction<T> {
	label: string;
	icon: React.ReactNode;
	onClick: (item: T) => void;
	color?: string;
	show?: (item: T) => boolean;
}
