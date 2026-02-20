import {
	Container,
	Box,
	Typography,
	Paper,
	Stack,
	Card,
	CardContent,
	Alert,
} from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { SettingsService } from "../../api/services/settings.service";

export default function ContactInfo() {
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadContactInfo = async () => {
		setLoading(true);
		try {
			const [emailRes, phoneRes, addressRes] = await Promise.all([
				SettingsService.getValue("CLINIC_EMAIL"),
				SettingsService.getValue("CLINIC_PHONE"),
				SettingsService.getValue("CLINIC_ADDRESS"),
			]);

			setEmail(emailRes);
			setPhone(phoneRes);
			setAddress(addressRes);

			setError("");
		} catch (err) {
			console.error("Failed to load contact info", err);
			setError("Could not load contact details.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadContactInfo();
	}, []);

	const CONTACT_DETAILS = [
		{
			icon: <Email />,
			title: "Email",
			lines: [email],
		},
		{
			icon: <Phone />,
			title: "Phone",
			lines: [phone],
		},
		{
			icon: <LocationOn />,
			title: "Address",
			lines: [address],
		},
	];

	const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

	return (
		<Container
			maxWidth="lg"
			disableGutters
			sx={{
				pb: 8,
				display: "flex",
				flexWrap: "wrap",
				gap: 4,
				alignItems: "stretch",
			}}
		>
			{loading && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						py: 3,
						width: "100%",
					}}
				>
					Loading...
				</Box>
			)}
			{error && (
				<Alert
					severity="error"
					sx={{
						display: "flex",
						justifyContent: "center",
						py: 3,
						width: "100%",
					}}
				>
					{error}
				</Alert>
			)}
			<Paper
				sx={{
					p: 4,
					flex: 1,
					minWidth: "350px",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Typography
					variant="h4"
					color="primary"
					sx={{ fontWeight: 700, mb: 3 }}
				>
					Find Us
				</Typography>
				<Box
					component="iframe"
					src={mapSrc}
					sx={{
						width: "100%",
						flexGrow: 1,
						minHeight: 320,
						border: 0,
						borderRadius: 2,
					}}
				/>
			</Paper>

			<Stack
				spacing={2}
				sx={{ width: "300px", flex: "0 0 300px" }}
			>
				{CONTACT_DETAILS.map((item, i) => (
					<Card
						key={i}
						sx={{ flex: 1, display: "flex", alignItems: "center" }}
					>
						<CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Box sx={{ color: "primary.main", "& svg": { fontSize: 32 } }}>
								{item.icon}
							</Box>
							<Box>
								<Typography
									variant="h6"
									sx={{ fontWeight: 600, lineHeight: 1.2 }}
								>
									{item.title}
								</Typography>
								{item.lines.map((line, j) => (
									<Typography
										key={j}
										variant="body2"
										color="text.secondary"
									>
										{line}
									</Typography>
								))}
							</Box>
						</CardContent>
					</Card>
				))}
			</Stack>
		</Container>
	);
}
