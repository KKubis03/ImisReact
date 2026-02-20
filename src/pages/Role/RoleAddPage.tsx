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
import { RolesService } from "../../api/services/roles.service";

export default function RoleAddPage() {
	const navigate = useNavigate();
	const [roleName, setRoleName] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!roleName.trim()) {
			setError("Role name is required");
			return;
		}
		if (roleName.trim().length < 2) {
			setError("Role name must be at least 2 characters");
			return;
		}
		try {
			setLoading(true);
			setError("");
			await RolesService.createRole(roleName.trim());
			setSuccess("Role created successfully!");
			setTimeout(() => {
				navigate(-1);
			}, 500);
		} catch (err: any) {
			setError(
				err?.response?.data?.message || err?.message || "Failed to create role",
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
					Add New Role
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
						label="Role Name"
						value={roleName}
						onChange={(e) => {
							setRoleName(e.target.value);
							setError("");
						}}
						margin="normal"
						required
						helperText="Enter a unique role name (e.g., Manager, Editor)"
					/>
					<Box sx={{ mt: 3, display: "flex", gap: 2 }}>
						<Tooltip title="Save changes">
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={loading}
							>
								Save
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
