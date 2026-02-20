import { Box, Switch } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../../contexts/ThemeContext";

export default function DarkModeToggle() {
	const { mode, toggleTheme } = useThemeMode();
	return (
		<Box
			sx={{
				ml: 7,
				display: "flex",
				alignItems: "center",
				gap: 1,
				px: 1,
			}}
		>
			<DarkModeIcon
				fontSize="small"
				color="primary"
				sx={{ opacity: mode === "dark" ? 1 : 0.5 }}
			/>
			<Switch
				checked={mode !== "dark"}
				onChange={toggleTheme}
				inputProps={{ "aria-label": "toggle dark mode" }}
				size="small"
			/>
			<LightModeIcon
				fontSize="small"
				color="primary"
				sx={{ opacity: mode === "light" ? 1 : 0.5 }}
			/>
		</Box>
	);
}
