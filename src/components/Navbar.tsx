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
import { logout as apiLogout } from "../api/auth";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function ResponsiveNavbar() {
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
    // Prefer stored user object when available
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
      } catch {
        // ignore
      }
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
    // call centralized logout which clears storage and dispatches authChanged
    try {
      apiLogout();
    } catch {
      // fallback
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.dispatchEvent(
        new CustomEvent("authChanged", { detail: { token: null, user: null } }),
      );
    }
    handleUserMenuClose();
    // navigate home
    window.location.href = "/";
  };

  return (
    <AppBar
      position="fixed"
      // color="transparent"
      sx={{
        // backgroundColor: "rgba(0,0,0,0.1)",
        // backdropFilter: "blur(3px)",
        // color: "white",

        background: (theme) => theme.palette.primary.main,
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
        {/* ALL CENTERED */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3,
          }}
        >
          <Button color="inherit" component={Link} to="/">
            HOME
          </Button>

          {navLinks.map((item) => (
            <Button key={item.to} color="inherit" component={Link} to={item.to}>
              {item.label}
            </Button>
          ))}

          {!isAuthenticated ? (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          ) : (
            <>
              <Tooltip title={displayName || "User"}>
                <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
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
                  to="/profile"
                  onClick={handleUserMenuClose}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/dashboard"
                  onClick={handleUserMenuClose}
                >
                  Dashboard
                </MenuItem>
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
            {!isAuthenticated ? (
              <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                Login
              </MenuItem>
            ) : (
              [
                <MenuItem
                  key="profile"
                  component={Link}
                  to="/profile"
                  onClick={handleMenuClose}
                >
                  Profile
                </MenuItem>,
                <MenuItem
                  key="dashboard"
                  component={Link}
                  to="/admin/dashboard"
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
