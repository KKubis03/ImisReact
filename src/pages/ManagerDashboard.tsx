import React, { useEffect, useState } from "react";
import {
	Box,
	Container,
	Paper,
	Typography,
	Card,
	CardContent,
	Tabs,
	Tab,
	useTheme,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import PaidIcon from "@mui/icons-material/Paid";
import { LineChart } from "@mui/x-charts/LineChart";
import { DashboardService } from "../api/services/dashboard.service";
import type {
	ManagerStatsResponse,
	IncomeChartDataPoint,
} from "../api/services/dashboard.service";

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
export default function ManagerDashboard() {
	const theme = useTheme();
	const [timeRange, setTimeRange] = useState<0 | 1 | 2 | 3>(0);
	const [stats, setStats] = useState<ManagerStatsResponse>({
		plannedAppointments: 0,
		completedAppointments: 0,
		cancelledAppointments: 0,
		totalAppointments: 0,
		issuedInvoices: 0,
		paidInvoices: 0,
		totalInvoices: 0,
		totalIncome: 0,
	});
	const [incomeChartData, setIncomeChartData] = useState<
		IncomeChartDataPoint[]
	>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		loadDashboardData();
	}, []);
	useEffect(() => {
		loadStats();
	}, [timeRange]);
	const loadStats = async () => {
		try {
			const response = await DashboardService.getManagerStats(timeRange);
			setStats(response);
		} catch (err) {
			console.error("Failed to load manager stats", err);
		}
	};
	const loadDashboardData = async () => {
		try {
			setLoading(true);
			const chartResponse = await DashboardService.getManagerIncomeChart();
			setIncomeChartData(chartResponse);
		} catch (err) {
			console.error("Failed to load dashboard data", err);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Box sx={{ minHeight: "100vh", py: 4 }}>
			<Container maxWidth="lg">
				{}
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h4"
						sx={{ fontWeight: 700, mb: 1 }}
					>
						Manager Dashboard
					</Typography>
					<Typography color="textSecondary">
						Operational management and financial oversight.
					</Typography>
				</Box>
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
							value={0}
						/>
						<Tab
							label="Week"
							value={1}
						/>
						<Tab
							label="Month"
							value={2}
						/>
						<Tab
							label="Year"
							value={3}
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
						value={stats.plannedAppointments}
					/>
					<StatCard
						icon={CheckCircleIcon}
						title="Completed"
						value={stats.completedAppointments}
					/>
					<StatCard
						icon={CancelIcon}
						title="Cancelled"
						value={stats.cancelledAppointments}
					/>
					<StatCard
						icon={EventIcon}
						title="Total"
						value={stats.totalAppointments}
					/>
				</Box>
				{}
				<Typography
					variant="h5"
					sx={{ fontWeight: 700, mb: 2, mt: 4 }}
				>
					Financial Overview
				</Typography>
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
						icon={DescriptionIcon}
						title="Issued Invoices"
						value={stats.issuedInvoices}
					/>
					<StatCard
						icon={PaidIcon}
						title="Paid Invoices"
						value={stats.paidInvoices}
					/>
					<StatCard
						icon={DescriptionIcon}
						title="Total Invoices"
						value={stats.totalInvoices}
					/>
					<StatCard
						icon={AttachMoneyIcon}
						title="Total Income"
						value={`${stats.totalIncome.toFixed(2)} PLN`}
					/>
				</Box>
				{}
				<Paper sx={{ p: 3, mb: 4 }}>
					<Typography
						variant="h6"
						sx={{ fontWeight: 700, mb: 3 }}
					>
						Income Over Last 12 Months
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
						<LineChart
							xAxis={[
								{
									scaleType: "point",
									data: incomeChartData.map((item) => item.label),
								},
							]}
							series={[
								{
									data: incomeChartData.map((item) => item.value),
									label: "Income (PLN)",
									color: theme.palette.primary.main,
									curve: "linear",
								},
							]}
							height={250}
							margin={{ top: 10, bottom: 30, left: 60, right: 10 }}
						/>
					)}
				</Paper>
			</Container>
		</Box>
	);
}
