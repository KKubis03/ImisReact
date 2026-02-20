import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
	return (
		<Box
			sx={{
				backgroundColor: (theme) => theme.palette.primary.main,
				color: "white",
				py: 2,
				mt: "auto",
			}}
		>
			<Container maxWidth="lg">
				<Typography
					variant="body1"
					align="center"
				>
					© 2026 IMIS - Integrated Medical Information System
				</Typography>
			</Container>
		</Box>
	);
}
