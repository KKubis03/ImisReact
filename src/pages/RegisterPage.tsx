import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Alert,
	MenuItem,
} from "@mui/material";
import { PATHS } from "../routes/paths";
import { PatientsService } from "../api/services/patients.service";
import {
	validateFirstName,
	validateLastName,
	validatePesel,
	validateDateOfBirth,
	validateGender,
	validateEmail,
	validatePhoneNumber,
} from "../utils/validators";

export default function RegisterPage() {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [pesel, setPesel] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [gender, setGender] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({
		firstName: "",
		lastName: "",
		pesel: "",
		dateOfBirth: "",
		gender: "",
		email: "",
		phoneNumber: "",
	});
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = {
			firstName: validateFirstName(firstName),
			lastName: validateLastName(lastName),
			pesel: validatePesel(pesel),
			dateOfBirth: validateDateOfBirth(dateOfBirth),
			gender: validateGender(gender),
			email: validateEmail(email),
			phoneNumber: validatePhoneNumber(phoneNumber),
		};
		setErrors(newErrors);
		const hasErrors = Object.values(newErrors).some((error) => error !== "");
		if (hasErrors) {
			setError("Please fix all validation errors");
			return;
		}
		try {
			setLoading(true);
			setError("");
			await PatientsService.create({
				firstName,
				lastName,
				pesel,
				dateOfBirth,
				gender,
				email,
				phoneNumber,
			});
			setSuccess(
				"Account created successfully! You can now log in with your credentials.",
			);
			setTimeout(() => {
				navigate(PATHS.LOGIN);
			}, 3000);
		} catch (err) {
			setError("Failed to create account. Please try again.");
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
					Create Patient Account
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: 3 }}
				>
					Fill in your information to Create new patient account
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
						label="First Name"
						value={firstName}
						onChange={(e) => {
							setFirstName(e.target.value);
							setErrors((prev) => ({
								...prev,
								firstName: validateFirstName(e.target.value),
							}));
						}}
						margin="normal"
						required
						error={!!errors.firstName}
						helperText={errors.firstName}
						disabled={loading || !!success}
					/>
					<TextField
						fullWidth
						label="Last Name"
						value={lastName}
						onChange={(e) => {
							setLastName(e.target.value);
							setErrors((prev) => ({
								...prev,
								lastName: validateLastName(e.target.value),
							}));
						}}
						margin="normal"
						required
						error={!!errors.lastName}
						helperText={errors.lastName}
						disabled={loading || !!success}
					/>
					<TextField
						fullWidth
						label="PESEL"
						value={pesel}
						onChange={(e) => {
							setPesel(e.target.value);
							setErrors((prev) => ({
								...prev,
								pesel: validatePesel(e.target.value),
							}));
						}}
						margin="normal"
						inputProps={{ maxLength: 11 }}
						required
						error={!!errors.pesel}
						helperText={errors.pesel}
						disabled={loading || !!success}
					/>
					<TextField
						fullWidth
						label="Date of Birth"
						type="date"
						value={dateOfBirth}
						onChange={(e) => {
							setDateOfBirth(e.target.value);
							setErrors((prev) => ({
								...prev,
								dateOfBirth: validateDateOfBirth(e.target.value),
							}));
						}}
						margin="normal"
						InputLabelProps={{ shrink: true }}
						required
						error={!!errors.dateOfBirth}
						helperText={errors.dateOfBirth}
						disabled={loading || !!success}
					/>
					<TextField
						fullWidth
						select
						label="Gender"
						value={gender}
						onChange={(e) => {
							setGender(e.target.value);
							setErrors((prev) => ({
								...prev,
								gender: validateGender(e.target.value),
							}));
						}}
						margin="normal"
						required
						error={!!errors.gender}
						helperText={errors.gender}
						disabled={loading || !!success}
					>
						<MenuItem value="Male">Male</MenuItem>
						<MenuItem value="Female">Female</MenuItem>
						<MenuItem value="Other">Other</MenuItem>
					</TextField>
					<TextField
						fullWidth
						label="Email"
						type="email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setErrors((prev) => ({
								...prev,
								email: validateEmail(e.target.value),
							}));
						}}
						margin="normal"
						required
						error={!!errors.email}
						helperText={errors.email}
						disabled={loading || !!success}
					/>
					<TextField
						fullWidth
						label="Phone Number"
						value={phoneNumber}
						onChange={(e) => {
							setPhoneNumber(e.target.value);
							setErrors((prev) => ({
								...prev,
								phoneNumber: validatePhoneNumber(e.target.value),
							}));
						}}
						margin="normal"
						required
						error={!!errors.phoneNumber}
						helperText={errors.phoneNumber}
						disabled={loading || !!success}
					/>
					<Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={loading || !!success}
							fullWidth
						>
							{loading ? "Creating Account..." : "Create Account"}
						</Button>
						<Box sx={{ textAlign: "center" }}>
							<Typography
								variant="body2"
								color="text.secondary"
							>
								Already have an account?{" "}
								<Link
									to={PATHS.LOGIN}
									style={{ color: "inherit", textDecoration: "underline" }}
								>
									Log in here
								</Link>
							</Typography>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}
