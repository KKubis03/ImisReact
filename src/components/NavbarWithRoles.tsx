import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { label: "About", to: "/about" },
  { label: "Offer", to: "/offer" },
  { label: "Contact", to: "/contact" },
];

export default function NavbarWithRoles() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const [userAnchor, setUserAnchor] = React.useState<null | HTMLElement>(null);
  const isUserMenuOpen = Boolean(userAnchor);

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
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: (theme) => theme.palette.primary.main,
      }}
    >
      <Toolbar variant="dense" sx={{ display: "flex" }}>
        {/* LEFT */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="home"
          component={Link}
          to="/"
          sx={{ mr: 2 }}
        >
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" component="div">
          IMIS
        </Typography>

        {/* MIDDLE */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 2,
          }}
        >
          {navLinks.map((item) => (
            <Button key={item.to} color="inherit" component={Link} to={item.to}>
              {item.label}
            </Button>
          ))}

          {/* Warunkowe menu na podstawie ról */}
          {hasRole("Admin") && (
            <Button color="inherit" component={Link} to="/appointments">
              Appointments
            </Button>
          )}

          {hasRole("Doctor") && (
            <Button color="inherit" component={Link} to="/doctor/appointments">
              Moje Wizyty
            </Button>
          )}

          {hasRole("Admin") && (
            <Button color="inherit" component={Link} to="/dashboard">
              Admin Panel
            </Button>
          )}

          {hasRole("Doctor") && (
            <Button color="inherit" component={Link} to="/doctor/schedule">
              Panel Lekarza
            </Button>
          )}
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
            alignItems: "center",
          }}
        >
          {!isAuthenticated ? (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          ) : (
            <>
              {/* Wyświetl role użytkownika */}
              {user?.roles && user.roles.length > 0 && (
                <Box sx={{ display: "flex", gap: 0.5, mr: 1 }}>
                  {user.roles.map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      size="small"
                      color={role === "Admin" ? "secondary" : "default"}
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  ))}
                </Box>
              )}

              <Tooltip title={user?.email || "User"}>
                <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem",
                      bgcolor: "secondary.main",
                    }}
                  >
                    {(user?.email && user.email[0]?.toUpperCase()) || "U"}
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
                {hasRole("Admin") && (
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleUserMenuClose}
                  >
                    Profile
                  </MenuItem>
                )}

                {hasRole("Doctor") && (
                  <MenuItem
                    component={Link}
                    to="/doctor/profile"
                    onClick={handleUserMenuClose}
                  >
                    Profile
                  </MenuItem>
                )}

                {hasRole("Admin") && (
                  <MenuItem
                    component={Link}
                    to="/dashboard"
                    onClick={handleUserMenuClose}
                  >
                    Dashboard
                  </MenuItem>
                )}

                {hasRole("Doctor") && (
                  <MenuItem
                    component={Link}
                    to="/doctor/schedule"
                    onClick={handleUserMenuClose}
                  >
                    Mój Panel
                  </MenuItem>
                )}

                {hasRole("Admin") && (
                  <MenuItem
                    component={Link}
                    to="/appointments"
                    onClick={handleUserMenuClose}
                  >
                    Appointments
                  </MenuItem>
                )}

                {hasRole("Doctor") && (
                  <MenuItem
                    component={Link}
                    to="/doctor/appointments"
                    onClick={handleUserMenuClose}
                  >
                    Moje Wizyty
                  </MenuItem>
                )}

                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* HAMBURGER MENU */}
        <Box sx={{ display: { xs: "flex", md: "none" }, marginLeft: "auto" }}>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
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

            {hasRole("Admin") && (
              <MenuItem
                component={Link}
                to="/appointments"
                onClick={handleMenuClose}
              >
                Appointments
              </MenuItem>
            )}

            {hasRole("Doctor") && (
              <MenuItem
                component={Link}
                to="/doctor/appointments"
                onClick={handleMenuClose}
              >
                Moje Wizyty
              </MenuItem>
            )}

            {!isAuthenticated ? (
              <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                Login
              </MenuItem>
            ) : (
              [
                hasRole("Admin") && (
                  <MenuItem
                    key="profile-admin"
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    Profile
                  </MenuItem>
                ),
                hasRole("Doctor") && (
                  <MenuItem
                    key="profile-doctor"
                    component={Link}
                    to="/doctor/profile"
                    onClick={handleMenuClose}
                  >
                    Profile
                  </MenuItem>
                ),
                hasRole("Admin") && (
                  <MenuItem
                    key="dashboard"
                    component={Link}
                    to="/dashboard"
                    onClick={handleMenuClose}
                  >
                    Dashboard
                  </MenuItem>
                ),
                hasRole("Doctor") && (
                  <MenuItem
                    key="doctor-panel"
                    component={Link}
                    to="/doctor/schedule"
                    onClick={handleMenuClose}
                  >
                    Panel Lekarza
                  </MenuItem>
                ),
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
