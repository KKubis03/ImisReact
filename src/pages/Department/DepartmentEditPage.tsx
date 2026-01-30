import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { DepartmentsService } from "../../api/services/departments.service";
import { validateName, validateDescription } from "../../utils/validators";

export default function DepartmentEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadDepartment();
  }, [id]);

  const loadDepartment = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const response = await DepartmentsService.getById(Number(id));
      setName(response.data.name);
      setDescription(response.data.description);
    } catch (err) {
      setError("Failed to load department");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
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
      await DepartmentsService.update(Number(id), {
        id: Number(id),
        name,
        description,
      });
      setSuccess("Department updated successfully!");
      setTimeout(() => {
        navigate("/departments");
      }, 2000);
    } catch (err) {
      setError("Failed to update department");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Edit Department
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
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({
                ...prev,
                name: validateName(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.name}
            helperText={errors.name}
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
                onClick={() => navigate("/departments")}
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
