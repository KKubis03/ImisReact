import React from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
	title?: string;
	description?: string;
	ButtonText?: string;
	ButtonTooltip?: string;
	ButtonPath?: string;
	ButtonIcon?: React.ReactNode;
}
const Header: React.FC<HeaderProps> = ({
	title,
	description,
	ButtonText,
	ButtonTooltip,
	ButtonPath,
	ButtonIcon,
}) => {
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				mb: 3,
			}}
		>
			<Box>
				<Typography
					variant="h3"
					fontWeight={500}
					color="primary"
				>
					{title}
				</Typography>
				<Typography
					variant="body1"
					mt={1}
				>
					{description}
				</Typography>
			</Box>
			{ButtonText && (
				<Tooltip title={ButtonTooltip || ""}>
					<Button
						variant="contained"
						color="primary"
						startIcon={ButtonIcon}
						onClick={() => ButtonPath && navigate(ButtonPath)}
					>
						{ButtonText}
					</Button>
				</Tooltip>
			)}
		</Box>
	);
};
export default Header;
