import { createTheme } from "@mui/material/styles";

const myTheme = createTheme({
  palette: {
    primary: {
      main: "#80bd0f", // główny kolor
      contrastText: "#ffffff", // kolor tekstu na primary
    },
    secondary: {
      main: "#2b2b2b",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ff4800",
      contrastText: "#ffffff",
    },
    success: {
      main: "#5a8b2f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff", // Domyślne tło dla całej aplikacji
      paper: "#ffffff", // Tło dla komponentów Paper
    },
  },
  typography: {
    fontFamily: "Zalando Sans, Arial, sans-serif",
    h4: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
    },
  },
});

export default myTheme;
