import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Alert,
	Tooltip,
} from "@mui/material";
import { UsersService } from "../../api/services/user.service";
import { PATHS } from "../../routes/paths";
import { validateEmail } from "../../utils/validators";

export default function UserAddPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const emailError = validateEmail(email.trim());
		if (emailError) {
			setError(emailError);
			return;
		}
		try {
			setLoading(true);
			setError("");
			const response = await UsersService.create({ email: email.trim() });
			setSuccess("User created successfully!");
			setTimeout(() => {
				navigate(PATHS.USERS_EDIT(response.id));
			}, 500);
		} catch (err: any) {
			setError(
				err?.response?.data?.message || err?.message || "Failed to create user",
			);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Container
			maxWidth="md"
			sx={{ mt: 10, mb: 6 }}
		>
			<Paper sx={{ p: 4 }}>
				<Typography
					variant="h4"
					color="primary"
					gutterBottom
				>
					Add New User
				</Typography>
				{error && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
					>
						{error}
					</Alert>
				)}
				{success && (
					<Alert
						severity="success"
						sx={{ mb: 2 }}
					>
						{success}
					</Alert>
				)}
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ mt: 3 }}
				>
					<TextField
						fullWidth
						label="Email"
						type="email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setError("");
						}}
						margin="normal"
						required
						helperText="Enter user's email address"
					/>
					<Box sx={{ mt: 3, display: "flex", gap: 2 }}>
						<Tooltip title="Create user">
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={loading}
							>
								Create User
							</Button>
						</Tooltip>
						<Tooltip title="Cancel">
							<Button
								variant="outlined"
								onClick={() => navigate(-1)}
								disabled={loading}
							>
								Cancel
							</Button>
						</Tooltip>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}
