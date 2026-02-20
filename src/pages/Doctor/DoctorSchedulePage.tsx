import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Container,
	Box,
	Typography,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	CircularProgress,
	Alert,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	ScheduleService,
	type ScheduleListItem,
} from "../../api/services/schedule.service";
import {
	DoctorsService,
	type DoctorListItem,
} from "../../api/services/doctors.service";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/layout/Header";
import { PATHS } from "../../routes/paths";

const formatTime = (time: string) => time.substring(0, 5);

const formatDuration = (duration: string) => {
	const parts = duration.split(":");
	const hours = parseInt(parts[0]);
	const minutes = parseInt(parts[1]);
	if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
	if (hours > 0) return `${hours}h`;
	return `${minutes}min`;
};

export default function DoctorSchedulePage() {
	const navigate = useNavigate();
	const { user, hasRole } = useAuth();
	const { doctorId } = useParams<{ doctorId?: string }>();

	const isAdminView = !!doctorId;
	const effectiveDoctorId = isAdminView ? Number(doctorId) : user?.doctorId;
	const canEdit = isAdminView ? hasRole("Admin") : true;

	const [schedules, setSchedules] = useState<ScheduleListItem[]>([]);
	const [doctor, setDoctor] = useState<DoctorListItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

	useEffect(() => {
		loadData();
	}, [doctorId, user]);

	const loadData = async () => {
		if (!effectiveDoctorId) {
			setError("Doctor ID not found");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);

			if (isAdminView) {
				const [schedulesRes, doctorsRes] = await Promise.all([
					ScheduleService.getByDoctorId(effectiveDoctorId),
					DoctorsService.getAll(),
				]);
				setSchedules(schedulesRes);
				setDoctor(
					doctorsRes.items.find((d) => d.id === effectiveDoctorId) ?? null,
				);
			} else {
				const schedulesRes =
					await ScheduleService.getByDoctorId(effectiveDoctorId);
				setSchedules(schedulesRes);
			}

			setError("");
		} catch {
			setError("Failed to load schedule");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClick = (id: number) => {
		setScheduleToDelete(id);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (scheduleToDelete === null) return;
		try {
			await ScheduleService.delete(scheduleToDelete);
			setDeleteDialogOpen(false);
			setScheduleToDelete(null);
			loadData();
		} catch {
			setError("Failed to delete schedule");
			setDeleteDialogOpen(false);
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setScheduleToDelete(null);
	};

	const addPath = PATHS.DOCTORS_SCHEDULE_ADD(effectiveDoctorId ?? "");
	const allDaysScheduled = schedules.length >= 7;

	if (!isAdminView && loading) {
		return (
			<Container
				maxWidth="lg"
				sx={{ py: 4 }}
			>
				<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}

	if (!isAdminView) {
		return (
			<Container
				maxWidth="lg"
				sx={{ py: 4 }}
			>
				<Header
					title="My Schedule"
					description="View and manage your work schedule"
					ButtonText={allDaysScheduled ? "" : "New Schedule"}
					ButtonPath={allDaysScheduled ? "" : addPath}
				/>

				{error && (
					<Alert
						severity="error"
						sx={{ mb: 3 }}
					>
						{error}
					</Alert>
				)}

				{schedules.length === 0 && !error ? (
					<Paper sx={{ p: 4, textAlign: "center" }}>
						<Typography
							variant="body1"
							color="text.secondary"
							gutterBottom
						>
							You have not defined any schedules yet.
						</Typography>
						<Tooltip title="Create new schedule">
							<Button
								variant="contained"
								color="primary"
								startIcon={<AddIcon />}
								onClick={() => navigate(addPath)}
								sx={{ mt: 2 }}
							>
								Add Your First Schedule
							</Button>
						</Tooltip>
					</Paper>
				) : (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>
										<strong>Day of the Week</strong>
									</TableCell>
									<TableCell>
										<strong>Start Time</strong>
									</TableCell>
									<TableCell>
										<strong>End Time</strong>
									</TableCell>
									<TableCell>
										<strong>Slot Duration</strong>
									</TableCell>
									<TableCell align="right">
										<strong>Actions</strong>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{schedules.map((schedule) => (
									<TableRow key={schedule.id}>
										<TableCell>
											<Chip
												label={schedule.dayOfTheWeekLabel}
												color="primary"
											/>
										</TableCell>
										<TableCell>{formatTime(schedule.startTime)}</TableCell>
										<TableCell>{formatTime(schedule.endTime)}</TableCell>
										<TableCell>
											{formatDuration(schedule.slotDuration)}
										</TableCell>
										<TableCell align="right">
											<Tooltip title="Edit">
												<IconButton
													color="primary"
													onClick={() =>
														navigate(
															PATHS.DOCTORS_SCHEDULE_EDIT(
																user?.doctorId ?? "",
																schedule.id,
															),
														)
													}
												>
													<EditIcon />
												</IconButton>
											</Tooltip>
											<Tooltip title="Delete">
												<IconButton
													color="error"
													onClick={() => handleDeleteClick(schedule.id)}
												>
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}

				<Dialog
					open={deleteDialogOpen}
					onClose={handleDeleteCancel}
				>
					<DialogTitle>Confirm Deletion</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Are you sure you want to delete this schedule? This action is
							irreversible.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Tooltip title="Cancel">
							<Button onClick={handleDeleteCancel}>Cancel</Button>
						</Tooltip>
						<Tooltip title="Delete this item">
							<Button
								onClick={handleDeleteConfirm}
								color="error"
								autoFocus
							>
								Delete
							</Button>
						</Tooltip>
					</DialogActions>
				</Dialog>
			</Container>
		);
	}

	return (
		<Container
			maxWidth="lg"
			sx={{ mt: 10, mb: 6 }}
		>
			<Box sx={{ mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Box>
						<Typography
							variant="h3"
							color="primary"
						>
							Schedule for{" "}
							{doctor ? (
								<Box
									component="span"
									sx={{ fontWeight: "bold", color: "primary.main" }}
								>
									{doctor.firstName} {doctor.lastName}
								</Box>
							) : (
								"Doctor"
							)}
						</Typography>
						{doctor && (
							<Typography
								variant="body1"
								mt={1}
							>
								{doctor.specializationName} - {doctor.departmentName}
							</Typography>
						)}
					</Box>

					{canEdit && (
						<Tooltip
							title={
								allDaysScheduled
									? "All days of the week are already scheduled"
									: "Create new schedule"
							}
						>
							<span>
								<Button
									variant="contained"
									color="primary"
									startIcon={<AddIcon />}
									onClick={() => navigate(addPath)}
									disabled={allDaysScheduled}
								>
									Add Schedule
								</Button>
							</span>
						</Tooltip>
					)}
				</Box>
			</Box>

			{error && (
				<Alert
					severity="error"
					sx={{ mb: 2 }}
				>
					{error}
				</Alert>
			)}

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
					<CircularProgress />
				</Box>
			) : schedules.length === 0 ? (
				<Paper sx={{ p: 4, textAlign: "center" }}>
					<Typography
						variant="h6"
						color="text.secondary"
					>
						No schedules found for this doctor
					</Typography>
					{canEdit && (
						<Tooltip title="Create new schedule">
							<Button
								variant="contained"
								color="primary"
								startIcon={<AddIcon />}
								onClick={() => navigate(addPath)}
								sx={{ mt: 2 }}
							>
								Add First Schedule
							</Button>
						</Tooltip>
					)}
				</Paper>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Day of Week</TableCell>
								<TableCell>Start Time</TableCell>
								<TableCell>End Time</TableCell>
								<TableCell>Slot Duration</TableCell>
								{canEdit && <TableCell align="right">Actions</TableCell>}
							</TableRow>
						</TableHead>
						<TableBody>
							{schedules.map((schedule) => (
								<TableRow key={schedule.id}>
									<TableCell>
										<Chip
											label={schedule.dayOfTheWeekLabel}
											color="primary"
										/>
									</TableCell>
									<TableCell>{formatTime(schedule.startTime)}</TableCell>
									<TableCell>{formatTime(schedule.endTime)}</TableCell>
									<TableCell>{formatDuration(schedule.slotDuration)}</TableCell>
									{canEdit && (
										<TableCell align="right">
											<Tooltip title="Edit">
												<IconButton
													color="primary"
													onClick={() =>
														navigate(
															PATHS.DOCTORS_SCHEDULE_EDIT(
																doctorId ?? "",
																schedule.id,
															),
														)
													}
												>
													<EditIcon />
												</IconButton>
											</Tooltip>
											<Tooltip title="Delete">
												<IconButton
													color="error"
													onClick={() => handleDeleteClick(schedule.id)}
												>
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Dialog
				open={deleteDialogOpen}
				onClose={handleDeleteCancel}
			>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this schedule? This action cannot be
						undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Tooltip title="Cancel">
						<Button onClick={handleDeleteCancel}>Cancel</Button>
					</Tooltip>
					<Tooltip title="Delete this item">
						<Button
							onClick={handleDeleteConfirm}
							color="error"
							autoFocus
						>
							Delete
						</Button>
					</Tooltip>
				</DialogActions>
			</Dialog>
		</Container>
	);
}
