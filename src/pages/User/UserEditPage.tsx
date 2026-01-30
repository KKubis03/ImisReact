import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {
  getById,
  update,
  type UpdateUserDto,
} from "../../api/services/user.service";
import {
  getAllRoles,
  addUserToRole,
  removeUserFromRole,
  type Role,
} from "../../api/services/roles.service";
import { validateEmail } from "../../utils/validators";

export default function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [formData, setFormData] = useState<UpdateUserDto>({
    email: "",
  });

  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) {
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Load both user and roles in parallel
      const [user, roles] = await Promise.all([getById(id), getAllRoles()]);

      setFormData({
        email: user.email,
      });

      // Set available roles
      setAvailableRoles(roles);

      // Set user's current roles
      const currentRoles = user.roles || [];
      console.log("User roles from API:", currentRoles);
      console.log(
        "Available roles:",
        roles.map((r) => r.name),
      );
      setUserRoles(currentRoles);
      setSelectedRoles(new Set(currentRoles));
      console.log("Selected roles set:", new Set(currentRoles));

      setError("");
    } catch (err) {
      setError("Failed to load user data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (roleName: string, checked: boolean) => {
    setSelectedRoles((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(roleName);
      } else {
        newSet.delete(roleName);
      }
      return newSet;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate email on change
    if (name === "email") {
      setEmailTouched(true);
      const error = validateEmail(value);
      setEmailError(error);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === "email") {
      setEmailTouched(true);
      const error = validateEmail(formData.email);
      setEmailError(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Validate email before submitting
    const emailValidationError = validateEmail(formData.email);
    setEmailError(emailValidationError);

    if (emailValidationError) {
      setError("Please fix the validation errors before submitting");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      // Update user email
      await update(id, formData.email);

      // Update roles
      const rolesToAdd = Array.from(selectedRoles).filter(
        (role) => !userRoles.includes(role),
      );
      const rolesToRemove = userRoles.filter(
        (role) => !selectedRoles.has(role),
      );

      // Add new roles
      for (const roleName of rolesToAdd) {
        await addUserToRole(formData.email, roleName);
      }

      // Remove old roles
      for (const roleName of rolesToRemove) {
        await removeUserFromRole(formData.email, roleName);
      }

      setSuccessMessage("User updated successfully!");
      setTimeout(() => {
        navigate("/users");
      }, 1500);
    } catch (err) {
      setError("Failed to update user");
      console.error(err);
    } finally {
      setSaving(false);
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

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Typography variant="h3" color="primary" gutterBottom>
          Edit User
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update user information
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={emailTouched && !!emailError}
            helperText={emailTouched ? emailError : ""}
            sx={{ mb: 3 }}
          />

          {availableRoles.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                User Roles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select the roles for this user
              </Typography>
              <FormGroup>
                {availableRoles.map((role) => (
                  <FormControlLabel
                    key={role.id}
                    control={
                      <Checkbox
                        checked={selectedRoles.has(role.name)}
                        onChange={(e) =>
                          handleRoleChange(role.name, e.target.checked)
                        }
                        disabled={saving}
                      />
                    }
                    label={role.name}
                  />
                ))}
              </FormGroup>
            </>
          )}

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/users")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
