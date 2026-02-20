import React from "react";
import { Link } from "react-router-dom";
import {
	alpha,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	useTheme,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface NavButtonProps {
	label: string;
	icon?: React.ElementType;
	path?: string;
	onClick?: () => void;
	active?: boolean;
	sub?: boolean;
	color?: string;
	isExpanded?: boolean;
	onCloseMobile?: () => void;
	collapsible?: boolean;
}
const NavButton: React.FC<NavButtonProps> = ({
	label,
	icon: Icon,
	path,
	onClick,
	active,
	sub = false,
	color,
	isExpanded,
	onCloseMobile,
	collapsible = false,
}) => {
	const theme = useTheme();
	const handleClick = () => {
		if (onClick) onClick();
		if (path && onCloseMobile) onCloseMobile();
	};
	return (
		<ListItem
			disablePadding
			sx={{ display: "block", mb: 0.5 }}
		>
			<ListItemButton
				component={path ? Link : "div"}
				to={path as any}
				onClick={handleClick}
				sx={{
					borderRadius: 1,
					mx: 1,
					px: 1.5,
					pl: sub ? 6 : 1.5,
					color: color || "inherit",
					bgcolor: active
						? alpha(
								theme.palette.primary.main,
								theme.palette.mode === "light" ? 0.08 : 0.16,
							)
						: "transparent",
					"&:hover": {
						bgcolor:
							color === "error.main"
								? alpha(theme.palette.error.main, 0.08)
								: alpha(theme.palette.primary.main, 0.04),
						color: color === "error.main" ? "error.dark" : "primary.dark",
					},
				}}
			>
				{Icon && (
					<ListItemIcon sx={{ minWidth: 36, color: color || "primary.main" }}>
						<Icon fontSize="small" />
					</ListItemIcon>
				)}
				<ListItemText
					primary={label}
					primaryTypographyProps={{
						fontSize: sub ? "0.85rem" : "0.875rem",
						fontWeight: active || !sub ? 500 : 400,
					}}
				/>
				{collapsible && !path && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
			</ListItemButton>
		</ListItem>
	);
};
export default NavButton;
