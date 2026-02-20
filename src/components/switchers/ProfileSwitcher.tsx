import { useAuth } from "../../contexts/AuthContext";
import PatientProfilePage from "../../pages/Patient/PatientProfilePage";
import DoctorProfilePage from "../../pages/Doctor/DoctorProfilePage";
import LoadingCircle from "../ui/LoadingCircle";
import { Alert, Container } from "@mui/material";

const ProfileSwitcher = () => {
	const { user, loading } = useAuth();

	if (loading) return <LoadingCircle />;

	if (!user || !user.roles) {
		return (
			<Container
				maxWidth="xl"
				sx={{ mt: 10, mb: 6 }}
			>
				<Alert severity="error">No authorization.</Alert>
			</Container>
		);
	}

	if (user.roles.includes("Patient") && user.patientId) {
		return <PatientProfilePage />;
	}

	if (user.roles.includes("Doctor") && user.doctorId) {
		return <DoctorProfilePage />;
	}

	return (
		<Container
			maxWidth="xl"
			sx={{ mt: 10, mb: 6 }}
		>
			<Alert severity="warning">
				Profile not available for your role. Please contact administrator.
			</Alert>
		</Container>
	);
};

export default ProfileSwitcher;
