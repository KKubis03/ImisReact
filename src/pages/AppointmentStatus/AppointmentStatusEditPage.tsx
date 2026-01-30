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
import { AppointmentStatusesService } from "../../api/services/appointmentStatuses.service";

export default function AppointmentStatusEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [statusName, setStatusName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadStatus();
  }, [id]);

  const loadStatus = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const response = await AppointmentStatusesService.getById(Number(id));
      setStatusName(response.data.statusName);
      setDescription(response.data.description);
    } catch (err) {
      setError("Failed to load status");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!statusName || !description) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await AppointmentStatusesService.update(Number(id), {
        id: Number(id),
        statusName,
        description,
      });
      navigate("/appointment-statuses");
    } catch (err) {
      setError("Failed to update status");
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
          Edit Appointment Status
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Status Name"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            required
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
                onClick={() => navigate("/appointment-statuses")}
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
