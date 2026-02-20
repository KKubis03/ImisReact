import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface OwnerRouteProps {
	children: JSX.Element;
	resourceType: "doctor" | "patient" | "user";
}

export const OwnerRoute = ({ children, resourceType }: OwnerRouteProps) => {
	const { user } = useAuth();
	const { id, doctorId, patientId, userId } = useParams<{
		id: string;
		doctorId?: string;
		patientId?: string;
		userId?: string;
	}>();

	if (!user) return <Navigate to="/login" />;

	if (user.roles.includes("Admin")) {
		return children;
	}

	if (user.roles.includes("Manager")) {
		return children;
	}

	if (resourceType === "doctor" && user.roles.includes("Doctor")) {
		if (
			String(user.doctorId) === doctorId ||
			String(user.doctorId) === id ||
			String(user.doctorId) === userId
		) {
			return children;
		}
	}

	if (resourceType === "patient" && user.roles.includes("Patient")) {
		if (
			String(user.patientId) === patientId ||
			String(user.patientId) === id ||
			String(user.patientId) === userId
		) {
			return children;
		}
	}

	return <Navigate to="/unauthorized" />;
};
