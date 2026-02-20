import React, { useEffect, useMemo, useState } from "react";
import {
	Box,
	Container,
	Paper,
	Typography,
	Card,
	CardContent,
	Button,
	Stack,
	Alert,
	Chip,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import HistoryIcon from "@mui/icons-material/History";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import DescriptionIcon from "@mui/icons-material/Description";
import { MonetizationOn, Person } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import {
	type PatientDashboardAppointment,
	type PatientDashboardResponse,
} from "../../api/services/patients.service";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import { PATHS } from "../../routes/paths";
import { DashboardService } from "../../api/services/dashboard.service";

const StatCard = ({
	icon: Icon,
	title,
	value,
	description,
}: {
	icon: React.ElementType;
	title: string;
	value: string | number;
	description?: string;
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
					{description && (
						<Typography
							variant="caption"
							color="textSecondary"
						>
							{description}
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
const formatAppointmentDate = (date: string) => {
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) {
		return { date: "-", time: "-" };
	}
	return {
		date: parsed.toLocaleDateString("pl-PL"),
		time: parsed.toLocaleTimeString("pl-PL", {
			hour: "2-digit",
			minute: "2-digit",
		}),
	};
};
const getDoctorFullName = (appointment: PatientDashboardAppointment) =>
	`${appointment.doctorFullName}`.trim();
export default function PatientDashboard() {
	const { user } = useAuth();
	const [dashboardData, setDashboardData] =
		useState<PatientDashboardResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const patientId = user?.patientId ?? null;
	useEffect(() => {
		if (!patientId) {
			setDashboardData(null);
			return;
		}
		let isMounted = true;
		setLoading(true);
		DashboardService.getPatientDashboard(patientId)
			.then((response) => {
				if (!isMounted) return;
				setDashboardData(response);
			})
			.catch(() => {
				if (!isMounted) return;
				setDashboardData(null);
			})
			.finally(() => {
				if (!isMounted) return;
				setLoading(false);
			});
		return () => {
			isMounted = false;
		};
	}, [patientId]);
	const pastAppointments = useMemo(
		() => dashboardData?.pastAppoinments ?? [],
		[dashboardData],
	);
	const upcomingAppointment = dashboardData?.upcomingAppoinment ?? null;
	return (
		<Box sx={{ minHeight: "100vh", py: 4 }}>
			<Container maxWidth="lg">
				<Header
					title="Patient Dashboard"
					description="Manage your appointments and medical records."
				/>
				{}
				{upcomingAppointment && (
					<Alert
						severity="info"
						sx={{ mb: 4 }}
						action={
							<Button
								color="inherit"
								size="small"
								component={Link}
								to={PATHS.APPOINTMENTS_DETAILS(upcomingAppointment.id)}
							>
								Details
							</Button>
						}
					>
						<Typography
							variant="body2"
							sx={{ fontWeight: 600 }}
						>
							Upcoming appointment: {getDoctorFullName(upcomingAppointment)} -{" "}
							{formatAppointmentDate(upcomingAppointment.appointmentDate).date}{" "}
							{formatAppointmentDate(upcomingAppointment.appointmentDate).time}
						</Typography>
						<Typography variant="caption">
							{upcomingAppointment.appointmentTypeName}
						</Typography>
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
						icon={UpcomingIcon}
						title="Upcoming"
						value={dashboardData?.upcomingAppointments ?? 0}
						description="Planned"
					/>
					<StatCard
						icon={HistoryIcon}
						title="All appointments"
						value={dashboardData?.totalAppointments ?? 0}
						description="Total"
					/>
					<StatCard
						icon={DescriptionIcon}
						title="Cancelled"
						value={dashboardData?.cancelledAppointments ?? 0}
						description="Total"
					/>
					<StatCard
						icon={MonetizationOn}
						title="Payments"
						value={`${dashboardData?.totalSpent ?? "0.00"} PLN`}
						description="Total Spent"
					/>
				</Box>
				{}
				<Box
					sx={{
						display: "flex",
						gap: 3,
						mb: 4,
						alignItems: "stretch",
						flexDirection: { xs: "column", lg: "row" },
					}}
				>
					<Box sx={{ flex: 1, display: "flex" }}>
						{}
						<Paper sx={{ p: 3, flex: 1 }}>
							<Typography
								variant="h6"
								sx={{ fontWeight: 700, mb: 3 }}
							>
								Past Appointments
							</Typography>
							<Stack spacing={2}>
								{pastAppointments.map((appointment) => (
									<Box
										key={appointment.id}
										sx={{
											p: 2,
											borderRadius: 1,
										}}
									>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												mb: 1,
											}}
										>
											<Typography
												variant="body2"
												sx={{ fontWeight: 600 }}
											>
												{"Dr. " + getDoctorFullName(appointment)}
											</Typography>
											<Typography variant="caption">
												{
													formatAppointmentDate(appointment.appointmentDate)
														.date
												}
											</Typography>
										</Box>
										<Typography
											variant="caption"
											display="block"
											sx={{ mb: 1 }}
										>
											{appointment.appointmentTypeName}
										</Typography>
										<Chip
											label={appointment.appointmentStatusName}
											color="primary"
										/>
									</Box>
								))}
							</Stack>
							<Button
								variant="text"
								fullWidth
								sx={{ mt: 2 }}
								component={Link}
								to={PATHS.PROFILE}
								disabled={loading || pastAppointments.length === 0}
							>
								View All Past Appointments
							</Button>
						</Paper>
					</Box>
					<Box
						sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
					>
						<Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
							<Person sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
							<Typography
								variant="h6"
								sx={{ fontWeight: 700, mb: 1 }}
							>
								Check Profile
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
								sx={{ mb: 2 }}
							>
								View and update your personal information
							</Typography>
							<Button
								variant="contained"
								size="small"
								component={Link}
								to={PATHS.PROFILE}
							>
								View Profile
							</Button>
						</Paper>
						<Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
							<EventIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
							<Typography
								variant="h6"
								sx={{ fontWeight: 700, mb: 1 }}
							>
								Schedule Appointment
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
								sx={{ mb: 2 }}
							>
								Schedule a new appointment with your doctor
							</Typography>
							<Button
								variant="contained"
								size="small"
								component={Link}
								to={PATHS.PATIENT.SCHEDULE}
							>
								Schedule Now
							</Button>
						</Paper>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}
