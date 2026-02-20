import { useAuth } from "../../contexts/AuthContext";
import AdminDashboard from "../../pages/AdminDashboard";
import PatientDashboard from "../../pages/Patient/PatientDashboard";
import DoctorDashboard from "../../pages/Doctor/DoctorDashboard";
import ManagerDashboard from "../../pages/ManagerDashboard";
import LoadingCircle from "../ui/LoadingCircle";

const DashboardSwitcher = () => {
	const { user, loading } = useAuth();
	if (loading) return <LoadingCircle />;

	if (!user || !user.roles) return <div>No authorization.</div>;

	if (user.roles.includes("Admin")) {
		return <AdminDashboard />;
	}

	if (user.roles.includes("Doctor")) {
		return <DoctorDashboard />;
	}

	if (user.roles.includes("Manager")) {
		return <ManagerDashboard />;
	}

	if (user.roles.includes("Patient")) {
		return <PatientDashboard />;
	}
	return <div></div>;
};
export default DashboardSwitcher;
