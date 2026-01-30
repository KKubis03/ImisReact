import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Tooltip,
} from "@mui/material";
import { SettingsService } from "../../api/services/settings.service";

export default function SettingAddPage() {
  const navigate = useNavigate();
  const [settingKey, setSettingKey] = useState("");
  const [settingValue, setSettingValue] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    settingKey: "",
    settingValue: "",
    description: "",
  });

  const validateSettingKey = (value: string): string => {
    if (!value.trim()) {
      return "Setting key is required";
    }
    if (value.length < 2) {
      return "Setting key must be at least 2 characters";
    }
    if (value.length > 100) {
      return "Setting key must not exceed 100 characters";
    }
    return "";
  };

  const validateSettingValue = (value: string): string => {
    if (!value.trim()) {
      return "Setting value is required";
    }
    if (value.length < 1) {
      return "Setting value must be at least 1 character";
    }
    if (value.length > 500) {
      return "Setting value must not exceed 500 characters";
    }
    return "";
  };

  const validateDescription = (value: string): string => {
    if (!value.trim()) {
      return "Description is required";
    }
    if (value.length < 5) {
      return "Description must be at least 5 characters";
    }
    if (value.length > 500) {
      return "Description must not exceed 500 characters";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      settingKey: validateSettingKey(settingKey),
      settingValue: validateSettingValue(settingValue),
      description: validateDescription(description),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      setError("Please fix all validation errors");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await SettingsService.create({
        settingKey,
        settingValue,
        description,
      });
      setSuccess("Setting created successfully!");
      setTimeout(() => {
        navigate("/settings");
      }, 2000);
    } catch (err) {
      setError("Failed to create setting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Add New Setting
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Setting Key"
            value={settingKey}
            onChange={(e) => {
              setSettingKey(e.target.value);
              setErrors((prev) => ({
                ...prev,
                settingKey: validateSettingKey(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.settingKey}
            helperText={errors.settingKey}
          />

          <TextField
            fullWidth
            label="Setting Value"
            value={settingValue}
            onChange={(e) => {
              setSettingValue(e.target.value);
              setErrors((prev) => ({
                ...prev,
                settingValue: validateSettingValue(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.settingValue}
            helperText={errors.settingValue}
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({
                ...prev,
                description: validateDescription(e.target.value),
              }));
            }}
            margin="normal"
            multiline
            rows={4}
            required
            error={!!errors.description}
            helperText={errors.description}
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Tooltip title="Save changes">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Save
              </Button>
            </Tooltip>
            <Tooltip title="Cancel">
              <Button
                variant="outlined"
                onClick={() => navigate("/settings")}
                disabled={loading}
              >
                Cancel
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
