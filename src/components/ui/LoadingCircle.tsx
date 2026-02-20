import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingCircle: React.FC = () => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				mt: 10,
			}}
		>
			<CircularProgress />
		</Box>
	);
};
export default LoadingCircle;
