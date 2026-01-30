import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: 6 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
