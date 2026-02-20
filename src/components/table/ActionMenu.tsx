import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import type { MenuAction } from "../../interfaces/MenuActionInterface";

interface ActionMenuProps<T> {
	anchorEl: HTMLElement | null;
	open: boolean;
	onClose: () => void;
	selectedItem: T | null;
	actions: MenuAction<T>[];
}

const ActionMenu = <T,>({
	anchorEl,
	open,
	onClose,
	selectedItem,
	actions,
}: ActionMenuProps<T>) => {
	if (!selectedItem) return null;

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			disableScrollLock
		>
			{actions.map((action, index) => {
				if (action.show && !action.show(selectedItem)) return null;
				return (
					<MenuItem
						key={index}
						onClick={() => {
							action.onClick(selectedItem);
							onClose();
						}}
					>
						<ListItemIcon>{action.icon}</ListItemIcon>
						<ListItemText>{action.label}</ListItemText>
					</MenuItem>
				);
			})}
		</Menu>
	);
};
export default ActionMenu;
