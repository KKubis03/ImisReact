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
	Stack,
	LinearProgress,
	Alert,
	useTheme,
	Tabs,
	Tab,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAuth } from "../../contexts/AuthContext";
import { AppointmentsService } from "../../api/services/appointments.service";
import type {
	DailyStatistics,
	MonthlyStatistics,
} from "../../api/services/doctors.service";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import PersonalInjuryOutlinedIcon from "@mui/icons-material/PersonalInjuryOutlined";
import Header from "../../components/layout/Header";
import { PATHS } from "../../routes/paths";
import { DashboardService } from "../../api/services/dashboard.service";

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
export default function DoctorDashboard() {
	const { user } = useAuth();
	const theme = useTheme();
	const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");
	const [dashboardData, setDashboardData] = useState({
		day: {
			planned: 0,
			completed: 0,
			remaining: 0,
			patients: 0,
		},
		week: {
			planned: 0,
			completed: 0,
			remaining: 0,
			patients: 0,
		},
		month: {
			planned: 0,
			completed: 0,
			remaining: 0,
			patients: 0,
		},
	});
	const [weeklyStats, setWeeklyStats] = useState<DailyStatistics[]>([]);
	const [monthlyStats, setMonthlyStats] = useState<MonthlyStatistics[]>([]);
	const [unprocessedCount, setUnprocessedCount] = useState(0);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const loadDashboardData = async () => {
			if (!user?.doctorId) return;
			try {
				setLoading(true);
				const statsResponse = await DashboardService.getDoctorDashboardStats(
					user.doctorId,
				);
				setWeeklyStats(statsResponse.weeklyStats);
				setMonthlyStats(statsResponse.monthlyStats);
				const unprocessedResponse = await AppointmentsService.getUnprocessed(
					user.doctorId,
				);
				setUnprocessedCount(
					unprocessedResponse.numberOfUnprocessedAppointments,
				);
			} catch (err) {
				console.error("Failed to load dashboard data", err);
			} finally {
				setLoading(false);
			}
		};
		loadDashboardData();
	}, [user]);
	useEffect(() => {
		const loadRangeData = async () => {
			if (!user?.doctorId) return;
			if (
				dashboardData[timeRange].planned !== 0 ||
				dashboardData[timeRange].completed !== 0
			) {
				return;
			}
			try {
				const rangeMap = { day: 0, week: 1, month: 2 } as const;
				const rangeData = await DashboardService.getDoctorDashboardRange(
					user.doctorId,
					rangeMap[timeRange],
				);
				setDashboardData((prev) => ({
					...prev,
					[timeRange]: {
						planned: rangeData.planned,
						completed: rangeData.completed,
						remaining: rangeData.remaining,
						patients: rangeData.patients,
					},
				}));
			} catch (err) {
				console.error(`Failed to load ${timeRange} range data`, err);
			}
		};
		loadRangeData();
	}, [timeRange, user]);
	return (
		<Box sx={{ minHeight: "100vh", py: 4 }}>
			<Container maxWidth="lg">
				<Header
					title="Doctor Dashboard"
					description={`Hello ${user?.fullName}! Here is your summary.`}
				/>
				{}
				{unprocessedCount > 0 && (
					<Alert
						severity="warning"
						sx={{ mb: 4 }}
						action={
							<Button
								component={Link}
								color="inherit"
								size="small"
								to={PATHS.DOCTORS_MY_APPOINTMENTS}
							>
								Go to Appointments
							</Button>
						}
					>
						<Typography
							variant="body2"
							sx={{ fontWeight: 600 }}
						>
							You have {unprocessedCount} unprocessed appointment
							{unprocessedCount !== 1 ? "s" : ""} waiting for review.
						</Typography>
					</Alert>
				)}
				{}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}
				>
					<Typography
						variant="h5"
						sx={{ fontWeight: 700 }}
					>
						Appointments Overview
					</Typography>
					<Tabs
						value={timeRange}
						onChange={(_, newValue) => setTimeRange(newValue)}
						sx={{
							minHeight: "36px",
							"& .MuiTab-root": {
								minHeight: "36px",
								py: 0.5,
								px: 2,
								fontSize: "0.875rem",
							},
						}}
					>
						<Tab
							label="Day"
							value="day"
						/>
						<Tab
							label="Week"
							value="week"
						/>
						<Tab
							label="Month"
							value="month"
						/>
					</Tabs>
				</Box>
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
						icon={EventIcon}
						title="Planned"
						value={dashboardData[timeRange].planned}
					/>
					<StatCard
						icon={CheckCircleIcon}
						title="Completed"
						value={dashboardData[timeRange].completed}
					/>
					<StatCard
						icon={PendingIcon}
						title="Remaining"
						value={dashboardData[timeRange].remaining}
					/>
					<StatCard
						icon={PersonalInjuryOutlinedIcon}
						title="My Patients"
						value={dashboardData[timeRange].patients}
					/>
				</Box>
				{}
				<Box
					sx={{
						display: "flex",
						gap: 3,
						mb: 4,
						flexDirection: { xs: "column", lg: "row" },
					}}
				>
					{}
					<Box sx={{ flex: 1 }}>
						<Paper sx={{ p: 3, height: "100%" }}>
							<Typography
								variant="h6"
								sx={{ fontWeight: 700, mb: 3 }}
							>
								Appointments in the Last 6 Months
							</Typography>
							{loading ? (
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: 250,
									}}
								>
									<Typography color="textSecondary">Loading...</Typography>
								</Box>
							) : (
								<BarChart
									xAxis={[
										{
											scaleType: "band",
											data: monthlyStats.map((stat) => stat.month),
										},
									]}
									series={[
										{
											data: monthlyStats.map((stat) => stat.appointments),
											label: "Number of Appointments",
											color: theme.palette.primary.main,
										},
									]}
									height={250}
									margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
								/>
							)}
						</Paper>
					</Box>
					{}
					<Box sx={{ flex: 1 }}>
						<Paper sx={{ p: 3, height: "100%" }}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mb: 2,
								}}
							>
								<Typography
									variant="h6"
									sx={{ fontWeight: 700 }}
								>
									Weekly Overview
								</Typography>
								<Typography
									variant="caption"
									color="textSecondary"
									sx={{ fontWeight: 500 }}
								>
									Completed
								</Typography>
							</Box>
							<Stack spacing={1}>
								{loading ? (
									<Box sx={{ py: 4, textAlign: "center" }}>
										<Typography color="textSecondary">Loading...</Typography>
									</Box>
								) : (
									weeklyStats.map((stat, index) => {
										const completionPercentage =
											stat.appointments > 0
												? (stat.completed / stat.appointments) * 100
												: 0;
										return (
											<Box key={index}>
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														mb: 0.5,
													}}
												>
													<Typography
														variant="body2"
														sx={{ fontWeight: 500 }}
													>
														{stat.day}
													</Typography>
													<Typography
														variant="body2"
														sx={{ fontWeight: 600 }}
													>
														{stat.completed}/{stat.appointments}
													</Typography>
												</Box>
												<LinearProgress
													variant="determinate"
													value={completionPercentage}
													sx={{
														height: 8,
														borderRadius: 1,
														bgcolor: "action.hover",
														"& .MuiLinearProgress-bar": {
															bgcolor: "primary.main",
														},
													}}
												/>
											</Box>
										);
									})
								)}
							</Stack>
						</Paper>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}
