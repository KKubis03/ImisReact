import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Container,
	Box,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Button,
	Divider,
	Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import {
	DoctorsService,
	type Doctor,
} from "../../api/services/doctors.service";
import { useAuth } from "../../contexts/AuthContext";
import { PATHS } from "../../routes/paths";
import Header from "../../components/layout/Header";

export default function DoctorProfilePage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { user } = useAuth();
	const [doctor, setDoctor] = useState<Doctor | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	useEffect(() => {
		loadDoctorData();
	}, [id, user]);
	const loadDoctorData = async () => {
		const doctorId = id || (user?.doctorId ? String(user.doctorId) : null);
		if (!doctorId) {
			setError("Invalid doctor ID");
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const doctorResponse = await DoctorsService.getById(parseInt(doctorId));
			setDoctor(doctorResponse);
			setError("");
		} catch (err) {
			setError("Failed to load doctor data");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	if (loading) {
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
	if (!doctor) {
		return (
			<Container
				maxWidth="lg"
				sx={{ py: 4 }}
			>
				<Alert severity="error">Doctor not found</Alert>
				<Tooltip title="Go back">
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => navigate(-1)}
						sx={{ mt: 2 }}
					>
						Back
					</Button>
				</Tooltip>
			</Container>
		);
	}
	return (
		<Container
			maxWidth="lg"
			sx={{ py: 4 }}
		>
			<Header
				title="Doctor Profile"
				description="View and edit your personal information"
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
			<Paper sx={{ p: 3, mb: 3 }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						mb: 3,
					}}
				>
					<Typography
						variant="h5"
						gutterBottom
						color="primary"
					>
						Personal Information
					</Typography>
					<Tooltip title="Edit details">
						<Button
							variant="contained"
							color="primary"
							startIcon={<EditIcon />}
							onClick={() => navigate(PATHS.DOCTORS_EDIT(doctor.id))}
						>
							Edit
						</Button>
					</Tooltip>
				</Box>
				<Divider sx={{ mb: 3 }} />
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
						gap: 3,
					}}
				>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Full Name
								</Typography>
								<Typography variant="body1">
									{doctor.firstName} {doctor.lastName}
								</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									License Number
								</Typography>
								<Typography variant="body1">{doctor.licenseNumber}</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Specialization
								</Typography>
								<Typography variant="body1">
									{doctor.specializationName}
								</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Department
								</Typography>
								<Typography variant="body1">{doctor.departmentName}</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Email
								</Typography>
								<Typography variant="body1">{doctor.email}</Typography>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									Phone Number
								</Typography>
								<Typography variant="body1">{doctor.phoneNumber}</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}
