import React from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { Box, Button, Typography } from "@mui/material";

const UnauthorizedPage: React.FC = () => {
	const navigate = useNavigate();
	return (
		<Box sx={{ textAlign: "center", py: 10 }}>
			<Typography
				variant="h1"
				sx={{ fontSize: "72px", fontWeight: "bold" }}
			>
				403
			</Typography>
			<Typography
				variant="h2"
				sx={{ fontSize: "24px", mb: 2 }}
			>
				Access Denied
			</Typography>
			<Typography
				variant="body1"
				color="text.secondary"
				sx={{ mb: 4 }}
			>
				You do not have permission to view this page.
			</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={() => navigate(PATHS.HOME)}
			>
				Go to Home Page
			</Button>
		</Box>
	);
};
export default UnauthorizedPage;
