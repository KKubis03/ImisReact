import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppointmentDetailsService,
  type AppointmentDetails,
} from "../../api/services/appointmentDetails.service";

export default function AppointmentDetailsEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await AppointmentDetailsService.getByAppointmentId(
        Number(id)
      );
      setDetails(response.data);
      setNotes(response.data.notes || "");
      setDiagnosis(response.data.diagnosis || "");
      setRecommendations(response.data.recommendations || "");
      setError("");
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // No details exist yet, allow creation
        setDetails(null);
      } else {
        setError("Failed to load appointment details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);
      setError("");

      if (details) {
        // Update existing details
        await AppointmentDetailsService.update(details.id, {
          id: details.id,
          appointmentId: details.appointmentId,
          notes: notes || null,
          diagnosis: diagnosis || null,
          recommendations: recommendations || null,
        });
        setSuccess("Details updated successfully!");
      } else {
        // Create new details
        await AppointmentDetailsService.create({
          appointmentId: Number(id),
          notes: notes || null,
          diagnosis: diagnosis || null,
          recommendations: recommendations || null,
        });
        setSuccess("Details created successfully!");
      }

      setTimeout(() => {
        navigate(`/appointments/details/${id}`);
      }, 1500);
    } catch (err) {
      setError("Failed to save appointment details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Typography variant="h3" color="primary" gutterBottom>
          {details ? "Edit" : "Add"} Appointment Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Appointment ID: {id}
        </Typography>
      </Box>

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

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter medical notes..."
          />

          <TextField
            fullWidth
            label="Diagnosis"
            multiline
            rows={4}
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis..."
          />

          <TextField
            fullWidth
            label="Recommendations"
            multiline
            rows={4}
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            placeholder="Enter recommendations..."
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/appointments/details/${id}`)}
              disabled={saving}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
