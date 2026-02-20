import { createTheme, type Theme } from "@mui/material/styles";

const createMyTheme = (mode: "light" | "dark"): Theme => {
	return createTheme({
		palette: {
			mode,
			primary: {
				main: "#43BCA1",
				contrastText: "#ffffff",
			},
			secondary: {
				main: "#BC435E",
				contrastText: "#ffffff",
			},
			error: {
				main: "#EF4444",
				contrastText: "#ffffff",
			},
			success: {
				main: "#4ADE80",
				contrastText: "#ffffff",
			},
			info: {
				main: "#2563EB",
				contrastText: "#ffffff",
			},
			warning: {
				main: "#FBBF24",
				contrastText: "#ffffff",
			},
			background: {
				default: mode === "light" ? "#ffffff" : "#1E1E1E",
				paper: mode === "light" ? "#fcfcfc" : "#272727",
			},
			text: {
				primary: mode === "light" ? "rgba(0, 0, 0, 0.87)" : "#ffffff",
				secondary:
					mode === "light" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.7)",
			},
		},
		typography: {
			fontFamily: "Zalando Sans, Arial, sans-serif",
			button: {
				textTransform: "none",
			},
		},
	});
};
export default createMyTheme;
