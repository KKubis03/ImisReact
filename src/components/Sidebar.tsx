import React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  IconButton,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
  Logout as LogoutIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../api/auth";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const DRAWER_WIDTH = 230;

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  subItems?: SidebarSubItem[];
}

interface SidebarSubItem {
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: DashboardIcon,
    path: "/dashboard",
  },
  {
    label: "Users",
    icon: AccountBoxIcon,
    path: "/users",
  },
  {
    label: "Patients",
    icon: PeopleIcon,
    path: "/patients",
  },
  {
    label: "Doctors",
    icon: AssignmentIndOutlinedIcon,
    subItems: [
      { label: "All Doctors", path: "/doctors" },
      { label: "Specializations", path: "/specializations" },
      { label: "Schedules", path: "/schedules" },
    ],
  },
  {
    label: "Invoices",
    icon: DescriptionIcon,
    subItems: [
      { label: "All Invoices", path: "/invoices" },
      { label: "Invoice Statuses", path: "/invoice-statuses" },
      { label: "Payment Methods", path: "/payment-methods" },
    ],
  },
  {
    label: "Appointments",
    icon: MedicalServicesIcon,
    subItems: [
      { label: "All Appointments", path: "/appointments" },
      { label: "Appointment Statuses", path: "/appointment-statuses" },
      { label: "Appointment Types", path: "/appointment-types" },
    ],
  },

  {
    label: "Settings",
    icon: SettingsIcon,
    subItems: [
      { label: "Settings", path: "/settings" },
      { label: "Discounts", path: "/discount" },
      { label: "Departments", path: "/departments" },
      { label: "PriceList", path: "/pricelist" },
    ],
  },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = true }: SidebarProps) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = React.useState(open);

  // Auto-expand parent menu when user is on a subitem page
  React.useEffect(() => {
    sidebarItems.forEach((item) => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(
          (subItem) => subItem.path === location.pathname,
        );
        if (isSubItemActive && !expandedItems.includes(item.label)) {
          setExpandedItems((prev) => [...prev, item.label]);
        }
      }
    });
  }, [location.pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

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
          IMIS Admin
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Management Panel
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
          <React.Fragment key={item.label}>
            {item.subItems ? (
              // Parent item with subItems
              <>
                <ListItem
                  disablePadding
                  sx={{
                    display: "block",
                    px: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemButton
                    onClick={() => toggleExpand(item.label)}
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
                    {expandedItems.includes(item.label) ? (
                      <ExpandLess sx={{ fontSize: 20 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 20 }} />
                    )}
                  </ListItemButton>
                </ListItem>

                {/* SubItems */}
                <Collapse
                  in={expandedItems.includes(item.label)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => {
                      const isActive = location.pathname === subItem.path;
                      return (
                        <ListItem
                          key={subItem.label}
                          disablePadding
                          sx={{
                            display: "block",
                            px: 1,
                            mb: 0.25,
                          }}
                        >
                          <ListItemButton
                            component={Link}
                            to={subItem.path}
                            sx={{
                              pl: 5,
                              borderRadius: 1,
                              fontSize: "0.9rem",
                              bgcolor: isActive
                                ? theme.palette.mode === "light"
                                  ? "rgba(63, 81, 181, 0.12)"
                                  : "rgba(63, 81, 181, 0.24)"
                                : "transparent",
                              "&:hover": {
                                bgcolor:
                                  theme.palette.mode === "light"
                                    ? "rgba(63, 81, 181, 0.04)"
                                    : "rgba(63, 81, 181, 0.12)",
                              },
                            }}
                          >
                            <ListItemText
                              primary={subItem.label}
                              primaryTypographyProps={{
                                fontSize: "0.9rem",
                                fontWeight: isActive ? 600 : 400,
                                color: isActive
                                  ? theme.palette.primary.main
                                  : "inherit",
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </>
            ) : (
              // Simple item without subItems
              <ListItem
                disablePadding
                sx={{
                  display: "block",
                  px: 1,
                  mb: 0.5,
                }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path || "#"}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    bgcolor:
                      location.pathname === item.path
                        ? theme.palette.mode === "light"
                          ? "rgba(63, 81, 181, 0.12)"
                          : "rgba(63, 81, 181, 0.24)"
                        : "transparent",
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
                      color:
                        location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.primary.main,
                    }}
                  >
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      color:
                        location.pathname === item.path
                          ? theme.palette.primary.main
                          : "inherit",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
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
            to="/account"
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
              <AccountCircleIcon />
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

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton size="small" onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {SidebarContent}
      </Drawer>
    );
  }

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
