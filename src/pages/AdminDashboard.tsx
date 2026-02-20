import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	Box,
	Container,
	Paper,
	Typography,
	Card,
	CardContent,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Avatar,
	Chip,
	Stack,
	CircularProgress,
	Alert,
} from "@mui/material";
import { People } from "@mui/icons-material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PhotoCameraFrontOutlinedIcon from "@mui/icons-material/PhotoCameraFrontOutlined";
import PersonalInjuryOutlinedIcon from "@mui/icons-material/PersonalInjuryOutlined";
import {
	DashboardService,
	type AdminDashboardResponse,
} from "../api/services/dashboard.service";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Header from "../components/layout/Header";

const StatCard = ({
	icon: Icon,
	title,
	value,
	trend,
	trendValue,
}: {
	icon: React.ElementType;
	title: string;
	value: string | number;
	trend?: "up" | "down";
	trendValue?: string;
}) => (
	<Card>
		<CardContent>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Box>
					<Typography
						color="textSecondary"
						gutterBottom
					>
						{title}
					</Typography>
					<Typography
						variant="h5"
						sx={{ fontWeight: 700, mb: 1 }}
					>
						{value}
					</Typography>
					{trend && trendValue && (
						<Typography
							variant="caption"
							sx={{
								color: trend === "up" ? "success.main" : "error.main",
								fontWeight: 600,
							}}
						>
							{trend === "up" ? "↑" : "↓"} {trendValue}
						</Typography>
					)}
				</Box>
				<Box
					sx={{
						p: 2,
						bgcolor: "primary.main",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Icon sx={{ fontSize: 32, color: "primary.contrastText" }} />
				</Box>
			</Box>
		</CardContent>
	</Card>
);
export default function AdminDashboard() {
	const [dashboardData, setDashboardData] =
		useState<AdminDashboardResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		let active = true;
		const loadDashboard = async () => {
			try {
				setLoading(true);
				const data = await DashboardService.getAdminDashboard();
				if (active) {
					setDashboardData(data);
					setError(null);
				}
			} catch (err: any) {
				if (active) {
					setError(err?.message || "Failed to load dashboard data");
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		};
		loadDashboard();
		return () => {
			active = false;
		};
	}, []);
	const roles = dashboardData?.rolesList ?? [];
	if (loading) {
		return (
			<Container
				maxWidth="lg"
				sx={{ mt: 10, mb: 6 }}
			>
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}
	return (
		<Box sx={{ minHeight: "100vh", py: 4 }}>
			<Container maxWidth="lg">
				<Header
					title="Admin Dashboard"
					description="Overview of system metrics and quick actions."
				/>
				{error && (
					<Alert
						severity="error"
						sx={{ mb: 3 }}
					>
						{error}
					</Alert>
				)}
				{}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
							md: "repeat(4, 1fr)",
						},
						gap: 3,
						mb: 4,
					}}
				>
					<StatCard
						icon={People}
						title="Users"
						value={dashboardData?.users ?? 0}
					/>
					<StatCard
						icon={PhotoCameraFrontOutlinedIcon}
						title="Doctors"
						value={dashboardData?.doctors ?? 0}
					/>
					<StatCard
						icon={PersonalInjuryOutlinedIcon}
						title="Patients"
						value={dashboardData?.patients ?? 0}
					/>
					<StatCard
						icon={BusinessOutlinedIcon}
						title="Departments"
						value={dashboardData?.departments ?? 0}
					/>
				</Box>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
						gap: 3,
						mb: 4,
					}}
				>
					<Paper sx={{ p: 2, textAlign: "center" }}>
						<Typography
							variant="h6"
							sx={{ fontWeight: 700, mb: 2 }}
						>
							Document Templates
						</Typography>
						<Typography
							variant="body2"
							sx={{ mb: 2 }}
						>
							Create, Modify and manage document templates
						</Typography>
						<Button
							variant="outlined"
							size="small"
							component={Link}
							to="/docs-templates"
						>
							Manage Templates
						</Button>
					</Paper>
					<Paper sx={{ p: 2, textAlign: "center" }}>
						<Typography
							variant="h6"
							sx={{ fontWeight: 700, mb: 2 }}
						>
							Manage Users
						</Typography>
						<Typography
							variant="body2"
							sx={{ mb: 2 }}
						>
							Add, edit, or remove users from the system.
						</Typography>
						<Button
							variant="outlined"
							size="small"
							component={Link}
							to="/users"
						>
							Manage Users
						</Button>
					</Paper>
					<Paper sx={{ p: 2, textAlign: "center" }}>
						<Typography
							variant="h6"
							sx={{ fontWeight: 700, mb: 2 }}
						>
							Settings
						</Typography>
						<Typography
							variant="body2"
							sx={{ mb: 2 }}
						>
							Update your preferences and configurations.
						</Typography>
						<Button
							variant="outlined"
							size="small"
							component={Link}
							to="/settings"
						>
							Open Settings
						</Button>
					</Paper>
				</Box>
				<Box
					sx={{
						display: "flex",
						gap: 3,
						mb: 4,
						flexDirection: { xs: "column", lg: "row" },
						alignItems: "stretch",
					}}
				>
					<Box sx={{ flex: { xs: 1, lg: 2 }, display: "flex" }}>
						<Paper
							sx={{
								p: 2,
								width: "100%",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mb: 3,
								}}
							>
								<Typography
									variant="h6"
									sx={{ fontWeight: 700 }}
								>
									Users
								</Typography>
								<Button
									variant="outlined"
									size="small"
									component={Link}
									to="/users"
								>
									View All
								</Button>
							</Box>
							<TableContainer>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell>Username</TableCell>
											<TableCell>Email</TableCell>
											<TableCell>Roles</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{(dashboardData?.usersList ?? []).length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={3}
													align="center"
												>
													<Typography
														color="textSecondary"
														variant="body2"
													>
														No users found
													</Typography>
												</TableCell>
											</TableRow>
										) : (
											(dashboardData?.usersList ?? []).map((user) => (
												<TableRow key={`${user.username}-${user.email}`}>
													<TableCell>
														<Box sx={{ display: "flex", alignItems: "center" }}>
															<Avatar
																sx={{
																	width: 32,
																	height: 32,
																	mr: 1,
																	bgcolor: "primary.light",
																}}
															>
																{user.username.charAt(0).toUpperCase()}
															</Avatar>
															{user.username}
														</Box>
													</TableCell>
													<TableCell>{user.email}</TableCell>
													<TableCell>
														<Stack
															direction="row"
															spacing={1}
															flexWrap="wrap"
														>
															{user.roles.map((role) => (
																<Chip
																	key={role}
																	label={role}
																	size="small"
																	color="primary"
																/>
															))}
														</Stack>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Box>
					<Box sx={{ flex: 1, display: "flex" }}>
						<Paper
							sx={{
								p: 3,
								width: "100%",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mb: 3,
								}}
							>
								<Typography
									variant="h6"
									sx={{ fontWeight: 700 }}
								>
									System Roles
								</Typography>
								<Button
									variant="outlined"
									size="small"
									component={Link}
									to="/roles"
								>
									Manage Roles
								</Button>
							</Box>
							<Stack spacing={1}>
								{roles.length === 0 ? (
									<Typography
										color="textSecondary"
										variant="body2"
									>
										No role data available
									</Typography>
								) : (
									roles.map((role) => (
										<Typography
											key={role}
											variant="body1"
											sx={{ width: "fit-content" }}
										>
											<FiberManualRecordIcon
												color="primary"
												fontSize="small"
												sx={{ verticalAlign: "middle" }}
											/>{" "}
											{role}
										</Typography>
									))
								)}
							</Stack>
						</Paper>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}
