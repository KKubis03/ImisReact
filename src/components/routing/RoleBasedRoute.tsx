import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
	children: React.ReactElement;
	redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	redirectTo = "/login",
}) => {
	const { isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				Loading...
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to={redirectTo}
				state={{ from: location }}
				replace
			/>
		);
	}

	return children;
};

interface RoleBasedRouteProps {
	children: React.ReactElement;
	allowedRoles?: string[];
	redirectTo?: string;
	fallback?: React.ReactElement;
}
 
export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
	children,
	allowedRoles,
	redirectTo = "/unauthorized",
	fallback,
}) => {
	const { isAuthenticated, hasRole, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				Loading...
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				state={{ from: location }}
				replace
			/>
		);
	}

	if (
		allowedRoles &&
		allowedRoles.length > 0 &&
		!allowedRoles.some((role) => hasRole(role))
	) {
		if (fallback) {
			return fallback;
		}
		return (
			<Navigate
				to={redirectTo}
				replace
			/>
		);
	}
	return children;
};
