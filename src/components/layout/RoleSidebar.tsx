import React, { useMemo, useEffect, useState } from "react";
import {
  Box,
  List,
  Collapse,
  Typography,
  useTheme,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as ProfileIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { PATHS } from "../../routes/paths";
import { SIDEBAR_ITEMS } from "../../constants/sidebarItems";
import NavButton from "./NavButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeMode } from "../../contexts/ThemeContext";
const DRAWER_WIDTH = 260;
export default function RoleSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { hasRole, logout } = useAuth();
  const { pathname } = useLocation();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const panelLabel = useMemo(() => {
    if (hasRole("Admin")) return "Admin";
    if (hasRole("Manager")) return "Manager";
    if (hasRole("Doctor")) return "Doctor";
    if (hasRole("Receptionist")) return "Receptionist";
    if (hasRole("Patient")) return "Patient";
    return "User";
  }, [hasRole]);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const filteredItems = useMemo(
    () =>
      SIDEBAR_ITEMS.filter((item) => !item.roles || item.roles.some(hasRole))
        .map((item) => ({
          ...item,
          subItems: item.subItems?.filter(
            (sub) => !sub.roles || sub.roles.some(hasRole),
          ),
        }))
        .filter((item) => item.path || (item.subItems?.length ?? 0) > 0),
    [hasRole],
  );
  useEffect(() => {
    const activeParent = filteredItems.find((i) =>
      i.subItems?.some((s) => s.path === pathname),
    );
    if (activeParent && !expandedItems.includes(activeParent.label)) {
      setExpandedItems((prev) => [...prev, activeParent.label]);
    }
  }, [pathname, filteredItems]);
  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    );
  };
  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          p: 2,
          px: 2.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "secondary.main",
            lineHeight: 1.2,
          }}
        >
          IMIS
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {panelLabel} Panel
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, py: 2, overflowY: "auto" }}>
        {filteredItems.map((item) => (
          <React.Fragment key={item.label}>
            <NavButton
              label={item.label}
              icon={item.icon}
              path={item.path}
              active={pathname === item.path}
              isExpanded={expandedItems.includes(item.label)}
              onCloseMobile={handleDrawerToggle}
              onClick={
                item.subItems ? () => toggleExpand(item.label) : undefined
              }
              collapsible={!!item.subItems}
            />
            {item.subItems && (
              <Collapse in={expandedItems.includes(item.label)} timeout="auto">
                <List disablePadding sx={{ mb: 1 }}>
                  {item.subItems.map((sub) => (
                    <NavButton
                      key={sub.label}
                      label={sub.label}
                      path={sub.path}
                      active={pathname === sub.path}
                      sub
                      onCloseMobile={handleDrawerToggle}
                    />
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
        <NavButton
          label={mode === "dark" ? "Light Mode" : "Dark Mode"}
          icon={DarkModeIcon}
          onClick={() => {
            toggleTheme();
          }}
          isExpanded={false}
        />
        <NavButton
          label="My Account"
          icon={ProfileIcon}
          path={PATHS.ACCOUNT}
          active={pathname === PATHS.ACCOUNT}
        />
        <NavButton
          label="Logout"
          icon={LogoutIcon}
          color="error.main"
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
        />
      </Box>
    </Box>
  );
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          display: { md: "none" },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            IMIS
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true, disableScrollLock: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
