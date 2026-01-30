import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  MedicalServices as AppointmentsIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { logout } from "../api/auth";

const DRAWER_WIDTH = 260;

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Appointments",
    icon: AppointmentsIcon,
    path: "/doctor/appointments",
  },
  {
    label: "My schedule",
    icon: CalendarIcon,
    path: "/doctor/schedule",
  },
];

export default function DoctorSidebar() {
  const theme = useTheme();

  const handleLogout = () => {
    try {
      logout();
    } catch {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    window.location.href = "/";
  };

  const SidebarContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: (t) =>
              `linear-gradient(90deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          IMIS Doctor
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Doctor Panel
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List
        sx={{
          flexGrow: 1,
          px: 0,
          py: 2,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.divider,
            borderRadius: "3px",
          },
        }}
      >
        {sidebarItems.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            sx={{
              display: "block",
              px: 1,
              mb: 0.5,
            }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 1,
                mx: 1,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "light"
                      ? "rgba(63, 81, 181, 0.08)"
                      : "rgba(63, 81, 181, 0.16)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: theme.palette.primary.main,
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItem
          disablePadding
          sx={{
            display: "block",
            px: 1,
            mb: 1,
          }}
        >
          <ListItemButton
            component={Link}
            to="/doctor/account"
            sx={{
              borderRadius: 1,
              mx: 1,
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "light"
                    ? "rgba(63, 81, 181, 0.08)"
                    : "rgba(63, 81, 181, 0.16)",
              },
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 40, color: theme.palette.primary.main }}
            >
              <ProfileIcon />
            </ListItemIcon>
            <ListItemText
              primary="My Profile"
              primaryTypographyProps={{
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          sx={{
            display: "block",
            px: 1,
          }}
        >
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              mx: 1,
              color: "error.main",
              "&:hover": {
                bgcolor: "rgba(244, 67, 54, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "error.main" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box
      component="aside"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
      }}
    >
      {SidebarContent}
    </Box>
  );
}
