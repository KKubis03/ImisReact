import React from "react";
import {
  Container,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import axiosClient from "../api/axiosClient";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail } from "../utils/validators";
import { update as updateUser } from "../api/services/user.service";

export default function AccountPage() {
  const { user: authUser, loading, refetchUser } = useAuth();
  const [editing, setEditing] = React.useState(false);
  const [editedEmail, setEditedEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [emailTouched, setEmailTouched] = React.useState(false);

  React.useEffect(() => {
    if (authUser) {
      setEditedEmail(authUser.email || "");
      setEmailError("");
      setEmailTouched(false);
    }
  }, [authUser]);

  const [pwdOpen, setPwdOpen] = React.useState(false);
  const [currentPwd, setCurrentPwd] = React.useState("");
  const [newPwd, setNewPwd] = React.useState("");
  const [confirmPwd, setConfirmPwd] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [newPwdError, setNewPwdError] = React.useState("");

  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState("");
  const [snackSeverity, setSnackSeverity] = React.useState<
    "success" | "error" | "info"
  >("info");

  const openChangePassword = () => {
    setPwdOpen(true);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setNewPwdError("");
  };
  const closeChangePassword = () => setPwdOpen(false);

  const showSnack = (
    msg: string,
    severity: "success" | "error" | "info" = "info",
  ) => {
    setSnackMsg(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleSnackClose = () => setSnackOpen(false);

  const validateNewPassword = (pwd: string) => {
    if (pwd.length === 0) {
      setNewPwdError("");
      return;
    }
    if (pwd.length < 6) {
      setNewPwdError("Password must be at least 6 characters");
      return;
    }
    if (!/[A-Z]/.test(pwd)) {
      setNewPwdError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      setNewPwdError("Password must contain at least one special character");
      return;
    }
    setNewPwdError("");
  };

  const validatePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      showSnack("Please fill all password fields", "error");
      return false;
    }
    if (newPwd.length < 6) {
      showSnack("New password must be at least 6 characters", "error");
      return false;
    }
    if (!/[A-Z]/.test(newPwd)) {
      showSnack(
        "New password must contain at least one uppercase letter",
        "error",
      );
      return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPwd)) {
      showSnack(
        "New password must contain at least one special character",
        "error",
      );
      return false;
    }
    if (newPwd !== confirmPwd) {
      showSnack("New password and confirmation do not match", "error");
      return false;
    }
    if (newPwd === currentPwd) {
      showSnack(
        "New password must be different from current password",
        "error",
      );
      return false;
    }
    return true;
  };

  const submitChangePassword = async () => {
    if (!validatePassword()) return;
    try {
      await axiosClient.post("/User/change-password", {
        oldPassword: currentPwd,
        newPassword: newPwd,
        confirmNewPassword: confirmPwd,
      });
      showSnack("Password changed successfully", "success");
      closeChangePassword();
    } catch (err: any) {
      const msgFromServer =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to change password";
      showSnack(msgFromServer, "error");
    }
  };

  const save = async () => {
    if (!authUser) return;

    // Walidacja emaila przed zapisaniem
    const emailValidationError = validateEmail(editedEmail);
    setEmailError(emailValidationError);
    setEmailTouched(true);

    if (emailValidationError) {
      showSnack("Please fix the email validation errors", "error");
      return;
    }

    try {
      // Wywołanie API do aktualizacji emaila
      await updateUser(authUser.id, editedEmail);

      showSnack("Profile updated successfully", "success");

      // Delay przed zamknięciem edycji i odświeżeniem danych
      setTimeout(async () => {
        setEditing(false);
        // Odśwież dane użytkownika z serwera
        await refetchUser();
      }, 1500);
    } catch (e) {
      console.error("Failed to save profile", e);
      showSnack("Failed to update profile", "error");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!authUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
        <Alert severity="error">User not found. Please log in again.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 6, backgroundColor: "f5f5f5" }}>
      <Paper sx={{ p: 4 }} elevation={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              bgcolor: "primary.main",
              fontSize: 36,
            }}
          >
            {(authUser?.fullname && authUser.fullname[0]?.toUpperCase()) ||
              (authUser?.fullname && authUser.fullname[0]?.toUpperCase()) ||
              (authUser?.email && authUser.email[0]?.toUpperCase()) ||
              "U"}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }} noWrap>
              {authUser?.fullname ||
                authUser?.userName ||
                authUser?.email ||
                "Profile"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your account details and settings.
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {(authUser?.roles || []).map((r) => (
                <Chip
                  key={r}
                  label={r}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2} component="form" noValidate>
          <TextField
            label="Email"
            fullWidth
            value={editing ? editedEmail : (authUser?.email ?? "")}
            onChange={(e) => {
              const value = e.target.value;
              setEditedEmail(value);
              if (editing) {
                setEmailTouched(true);
                const error = validateEmail(value);
                setEmailError(error);
              }
            }}
            onBlur={() => {
              if (editing) {
                setEmailTouched(true);
                const error = validateEmail(editedEmail);
                setEmailError(error);
              }
            }}
            disabled={!editing}
            error={editing && emailTouched && !!emailError}
            helperText={editing && emailTouched ? emailError : ""}
          />
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            {editing ? (
              <>
                <Tooltip title="Save changes">
                  <Button variant="contained" onClick={save} color="primary">
                    Save
                  </Button>
                </Tooltip>
                <Tooltip title="Cancel editing">
                  <Button variant="outlined" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Edit profile information">
                <Button variant="contained" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              </Tooltip>
            )}

            <Tooltip title="Change your password">
              <Button
                variant="outlined"
                color="primary"
                onClick={openChangePassword}
              >
                Change Password
              </Button>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      <Dialog
        open={pwdOpen}
        onClose={closeChangePassword}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Current password"
              type={showCurrent ? "text" : "password"}
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={showCurrent ? "Hide password" : "Show password"}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setShowCurrent((s) => !s)}
                      >
                        {showCurrent ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="New password"
              type={showNew ? "text" : "password"}
              value={newPwd}
              onChange={(e) => {
                setNewPwd(e.target.value);
                validateNewPassword(e.target.value);
              }}
              fullWidth
              error={!!newPwdError && newPwd.length > 0}
              helperText={
                newPwdError ||
                "At least 6 characters, one uppercase letter, one special character"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={showNew ? "Hide password" : "Show password"}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setShowNew((s) => !s)}
                      >
                        {showNew ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm new password"
              type={showConfirm ? "text" : "password"}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={showConfirm ? "Hide password" : "Show password"}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirm((s) => !s)}
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Tooltip title="Cancel password change">
            <Button onClick={closeChangePassword}>Cancel</Button>
          </Tooltip>
          <Tooltip title="Confirm password change">
            <Button variant="contained" onClick={submitChangePassword}>
              Change Password
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
      >
        <Alert
          severity={snackSeverity}
          onClose={handleSnackClose}
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
