import { Outlet } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import PatientSidebar from "./PatientSidebar";

const DRAWER_WIDTH = 260;

function PatientLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar - Hidden on mobile */}
      {!isMobile && <PatientSidebar />}

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          ml: !isMobile ? `${DRAWER_WIDTH}px` : 0,
        }}
      >
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default PatientLayout;
