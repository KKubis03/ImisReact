import React from "react";
import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	Button,
	Menu,
	MenuItem,
	Avatar,
	Tooltip,
	Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import DarkModeToggle from "../ui/DarkModeToggle";
const navLinks = [
	{ label: "Home", to: PATHS.HOME },
	{ label: "About", to: PATHS.ABOUT },
	{ label: "Services", to: PATHS.SERVICES },
	{ label: "Contact", to: PATHS.CONTACT },
];
export default function ResponsiveNavbar() {
	const { logout } = useAuth();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(anchorEl);
	const [userAnchor, setUserAnchor] = React.useState<null | HTMLElement>(null);
	const isUserMenuOpen = Boolean(userAnchor);
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);
	const [displayName, setDisplayName] = React.useState<string | null>(null);
	const parseJwt = (token: string) => {
		try {
			const payload = token.split(".")[1];
			const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
			const json = decodeURIComponent(
				atob(base64)
					.split("")
					.map(function (c) {
						return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
					})
					.join(""),
			);
			return JSON.parse(json);
		} catch (e) {
			return null;
		}
	};
	React.useEffect(() => {
		const userJson = localStorage.getItem("auth_user");
		const token = localStorage.getItem("auth_token");
		if (userJson) {
			try {
				const u = JSON.parse(userJson);
				setDisplayName(u?.email || u?.name || null);
				setIsAuthenticated(true);
			} catch {
				setDisplayName(null);
				setIsAuthenticated(Boolean(token));
			}
		} else if (token) {
			const payload = parseJwt(token);
			const name = payload?.name || payload?.email || payload?.sub || null;
			setDisplayName(name);
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
			setDisplayName(null);
		}
		const onStorage = (e: StorageEvent) => {
			if (e.key === "auth_user") {
				const t = e.newValue;
				if (t) {
					try {
						const u = JSON.parse(t);
						setDisplayName(u?.email || u?.name || null);
						setIsAuthenticated(true);
					} catch {
						setDisplayName(null);
						setIsAuthenticated(false);
					}
				} else {
					setIsAuthenticated(false);
					setDisplayName(null);
				}
			}
			if (e.key === "auth_token") {
				const t = e.newValue;
				if (t && !localStorage.getItem("auth_user")) {
					const p = parseJwt(t);
					setDisplayName(p?.name || p?.email || p?.sub || null);
					setIsAuthenticated(true);
				} else if (!t) {
					setIsAuthenticated(false);
					setDisplayName(null);
				}
			}
		};
		const onAuthChanged = (e: Event) => {
			try {
				const detail = (e as CustomEvent).detail;
				if (detail && detail.user) {
					setDisplayName(detail.user?.email || detail.user?.name || null);
					setIsAuthenticated(true);
				} else if (detail && detail.token) {
					const p = parseJwt(detail.token);
					setDisplayName(p?.name || p?.email || p?.sub || null);
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
					setDisplayName(null);
				}
			} catch {}
		};
		window.addEventListener("storage", onStorage);
		window.addEventListener("authChanged", onAuthChanged as EventListener);
		return () => {
			window.removeEventListener("storage", onStorage);
			window.removeEventListener("authChanged", onAuthChanged as EventListener);
		};
	}, []);
	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setUserAnchor(event.currentTarget);
	};
	const handleUserMenuClose = () => {
		setUserAnchor(null);
	};
	const handleLogout = () => {
		logout();
		handleUserMenuClose();
		window.location.href = "/";
	};
	return (
		<AppBar
			position="fixed"
			color="transparent"
			sx={{
				backgroundColor: (theme) => theme.palette.background.paper,
				color: (theme) => theme.palette.text.primary,
				borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
			}}
		>
			<Toolbar
				variant="dense"
				sx={{
					display: "flex",
					maxWidth: "1200px",
					width: "100%",
					margin: "0 auto",
					px: 2,
					justifyContent: "center",
					alignItems: "center",
					gap: 3,
				}}
			>
				{}
				<Box
					sx={{
						display: { xs: "none", md: "flex" },
						alignItems: "center",
						gap: 3,
					}}
				>
					{navLinks.map((item) => (
						<Button
							key={item.to}
							color="inherit"
							size="large"
							component={Link}
							to={item.to}
						>
							{item.label}
						</Button>
					))}
					<DarkModeToggle />
					{!isAuthenticated ? (
						<Button
							color="inherit"
							size="large"
							component={Link}
							to={PATHS.LOGIN}
						>
							Login
						</Button>
					) : (
						<>
							<Tooltip title={displayName || "User"}>
								<IconButton
									onClick={handleUserMenuOpen}
									sx={{ p: 0 }}
								>
									<Avatar
										sx={{
											width: 32,
											height: 32,
											fontSize: "0.875rem",
											bgcolor: "secondary.main",
										}}
									>
										{(displayName && displayName[0]?.toUpperCase()) || "U"}
									</Avatar>
								</IconButton>
							</Tooltip>
							<Menu
								anchorEl={userAnchor}
								open={isUserMenuOpen}
								onClose={handleUserMenuClose}
								anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
								transformOrigin={{ vertical: "top", horizontal: "right" }}
							>
								<MenuItem
									component={Link}
									to={PATHS.DASHBOARD}
									onClick={handleUserMenuClose}
								>
									Panel
								</MenuItem>
								<Divider />
								<MenuItem onClick={handleLogout}>Logout</MenuItem>
							</Menu>
						</>
					)}
				</Box>
				{}
				<Box sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }}>
					<IconButton
						color="inherit"
						aria-label="menu"
						onClick={handleMenuOpen}
					>
						<MenuIcon />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={isMenuOpen}
						onClose={handleMenuClose}
					>
						{navLinks.map((item) => (
							<MenuItem
								key={item.to}
								component={Link}
								to={item.to}
								onClick={handleMenuClose}
							>
								{item.label}
							</MenuItem>
						))}
						<MenuItem disableRipple>
							<DarkModeToggle />
						</MenuItem>
						{!isAuthenticated ? (
							<MenuItem
								component={Link}
								to={PATHS.LOGIN}
								onClick={handleMenuClose}
							>
								Login
							</MenuItem>
						) : (
							[
								<MenuItem
									key="profile"
									component={Link}
									to={PATHS.PROFILE}
									onClick={handleMenuClose}
								>
									Profile
								</MenuItem>,
								<MenuItem
									key="dashboard"
									component={Link}
									to={PATHS.DASHBOARD}
									onClick={handleMenuClose}
								>
									Dashboard
								</MenuItem>,
								<MenuItem
									key="logout"
									onClick={() => {
										handleMenuClose();
										handleLogout();
									}}
								>
									Logout
								</MenuItem>,
							]
						)}
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
