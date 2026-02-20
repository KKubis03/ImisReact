import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Container,
	Box,
	Typography,
	Paper,
	TextField,
	Button,
	CircularProgress,
	Alert,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { UsersService } from "../../api/services/user.service";
import {
	RolesService,
	type RoleListItem,
} from "../../api/services/roles.service";
import { validateEmail } from "../../utils/validators";

export default function UserEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [emailError, setEmailError] = useState("");
	const [emailTouched, setEmailTouched] = useState(false);
	const [formData, setFormData] = useState<{ email: string }>({
		email: "",
	});
	const [availableRoles, setAvailableRoles] = useState<RoleListItem[]>([]);
	const [userRoles, setUserRoles] = useState<string[]>([]);
	const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
	useEffect(() => {
		loadData();
	}, [id]);
	const loadData = async () => {
		if (!id) {
			setError("Invalid user ID");
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const [user, roles] = await Promise.all([
				UsersService.getById(id),
				RolesService.getRolesList(),
			]);
			setFormData({
				email: user.email,
			});
			setAvailableRoles(roles);
			const currentRoles = user.roles || [];
			console.log("User roles from API:", currentRoles);
			console.log(
				"Available roles:",
				roles.map((r) => r.name),
			);
			setUserRoles(currentRoles);
			setSelectedRoles(new Set(currentRoles));
			console.log("Selected roles set:", new Set(currentRoles));
			setError("");
		} catch (err) {
			setError("Failed to load user data");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const handleRoleChange = (roleName: string, checked: boolean) => {
		setSelectedRoles((prev) => {
			const newSet = new Set(prev);
			if (checked) {
				newSet.add(roleName);
			} else {
				newSet.delete(roleName);
			}
			return newSet;
		});
	};
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (name === "email") {
			setEmailTouched(true);
			const error = validateEmail(value);
			setEmailError(error);
		}
	};
	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name } = e.target;
		if (name === "email") {
			setEmailTouched(true);
			const error = validateEmail(formData.email);
			setEmailError(error);
		}
	};
	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;
		const emailValidationError = validateEmail(formData.email);
		setEmailError(emailValidationError);
		if (emailValidationError) {
			setError("Please fix the validation errors before submitting");
			return;
		}
		try {
			setSaving(true);
			setError("");
			setSuccessMessage("");
			await UsersService.updateEmail(id, formData.email);
			setSuccessMessage("Email updated successfully!");
		} catch (err) {
			setError("Failed to update email");
			console.error(err);
		} finally {
			setSaving(false);
		}
	};
	const handleRolesSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;
		try {
			setSaving(true);
			setError("");
			setSuccessMessage("");
			const rolesToAdd = Array.from(selectedRoles).filter(
				(role) => !userRoles.includes(role),
			);
			const rolesToRemove = userRoles.filter(
				(role) => !selectedRoles.has(role),
			);
			for (const roleName of rolesToAdd) {
				await RolesService.addUserToRole(formData.email, roleName);
			}
			for (const roleName of rolesToRemove) {
				await RolesService.removeUserFromRole(formData.email, roleName);
			}
			setUserRoles(Array.from(selectedRoles));
			setSuccessMessage("User roles updated successfully!");
			setTimeout(() => {
				navigate(-1);
			}, 500);
		} catch (err) {
			setError("Failed to update roles");
			console.error(err);
		} finally {
			setSaving(false);
		}
	};
	if (loading) {
		return (
			<Container
				maxWidth="md"
				sx={{ mt: 10, mb: 6 }}
			>
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}
	return (
		<Container
			maxWidth="md"
			sx={{ mt: 10, mb: 6 }}
		>
			<Box sx={{ mb: 3 }}>
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => navigate(-1)}
					sx={{ mb: 2 }}
				>
					Back
				</Button>
				<Typography
					variant="h3"
					color="primary"
					gutterBottom
				>
					Edit User
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
				>
					Update user information
				</Typography>
			</Box>
			{error && (
				<Alert
					severity="error"
					sx={{ mb: 3 }}
				>
					{error}
				</Alert>
			)}
			{successMessage && (
				<Alert
					severity="success"
					sx={{ mb: 3 }}
				>
					{successMessage}
				</Alert>
			)}
			{}
			<Paper sx={{ p: 4, mb: 3 }}>
				<Typography
					variant="h6"
					gutterBottom
				>
					Email Address
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: 3 }}
				>
					Update user's email address
				</Typography>
				<Box
					component="form"
					onSubmit={handleEmailSubmit}
					noValidate
				>
					<TextField
						fullWidth
						label="Email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						onBlur={handleBlur}
						required
						error={emailTouched && !!emailError}
						helperText={emailTouched ? emailError : ""}
						sx={{ mb: 3 }}
					/>
					<Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							startIcon={<SaveIcon />}
							disabled={saving}
						>
							{saving ? "Saving..." : "Update Email"}
						</Button>
					</Box>
				</Box>
			</Paper>
			{/* User Roles Section */}
			{availableRoles.length > 0 && (
				<Paper sx={{ p: 4 }}>
					<Typography
						variant="h6"
						gutterBottom
					>
						User Roles
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mb: 3 }}
					>
						Select the roles for this user
					</Typography>
					<Box
						component="form"
						onSubmit={handleRolesSubmit}
						noValidate
					>
						<FormGroup>
							{availableRoles.map((role) => (
								<FormControlLabel
									key={role.id}
									control={
										<Checkbox
											checked={selectedRoles.has(role.name)}
											onChange={(e) =>
												handleRoleChange(role.name, e.target.checked)
											}
											disabled={saving}
										/>
									}
									label={role.name}
								/>
							))}
						</FormGroup>
						<Box
							sx={{
								display: "flex",
								gap: 2,
								justifyContent: "flex-end",
								mt: 3,
							}}
						>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								startIcon={<SaveIcon />}
								disabled={saving}
							>
								{saving ? "Saving..." : "Update Roles"}
							</Button>
						</Box>
					</Box>
				</Paper>
			)}
		</Container>
	);
}
