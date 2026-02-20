import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import RoleSidebar from "./RoleSidebar";
const DRAWER_WIDTH = 260;
function RoleBasedLayout() {
	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
				backgroundColor: "background.default",
			}}
		>
			<RoleSidebar />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					ml: { md: `${DRAWER_WIDTH}px` },
					mt: { xs: "64px", md: 0 },
					width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
					overflowY: "auto",
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
}
export default RoleBasedLayout;
