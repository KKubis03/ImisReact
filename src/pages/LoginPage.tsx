import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { PATHS } from "../routes/paths";

export default function LoginPage() {
	const { login, user } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleLogin = async () => {
		setLoading(true);
		setError("");
		try {
			await login(email, password);
		} catch (err: any) {
			setError(err.message || "Failed to login. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (user && !loading) {
			navigate(PATHS.DASHBOARD);
		}
	}, [user, loading, navigate]);
	return (
		<Container
			maxWidth="md"
			sx={{ mt: 10, mb: 6 }}
		>
			<Paper sx={{ p: 4, maxWidth: 500, margin: "0 auto" }}>
				<Typography
					variant="h4"
					color="primary"
				>
					Login
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary"
					sx={{ mb: 3 }}
				>
					Enter your credentials to access your account
				</Typography>
				{error && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
					>
						{error}
					</Alert>
				)}
				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						handleLogin();
					}}
					sx={{ mt: 3 }}
				>
					<TextField
						fullWidth
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						margin="normal"
						required
						disabled={loading}
					/>
					<TextField
						fullWidth
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						margin="normal"
						required
						disabled={loading}
					/>
					<Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
							loading={loading}
						>
							Login
						</Button>
						<Box>
							<Typography
								variant="body2"
								color="text.secondary"
							>
								Don't have an account?{" "}
								<Link
									to="/register"
									style={{ color: "inherit", textDecoration: "underline" }}
								>
									Register Now
								</Link>
							</Typography>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}
