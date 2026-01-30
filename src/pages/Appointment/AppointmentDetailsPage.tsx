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
  Divider,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  AppointmentDetailsService,
  type AppointmentDetails,
} from "../../api/services/appointmentDetails.service";
import { useAuth } from "../../contexts/AuthContext";

export default function AppointmentDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [details, setDetails] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");
      setNotFound(false);
      const response = await AppointmentDetailsService.getByAppointmentId(
        Number(id)
      );

      if (!response.data || response.data === null) {
        setNotFound(true);
        setDetails(null);
      } else {
        setDetails(response.data);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
        setDetails(null);
        setError("");
      } else {
        setError("Failed to load appointment details");
        setNotFound(false);
      }
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Tooltip title="Go back">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Tooltip>
      </Container>
    );
  }

  if (notFound) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
        <Box sx={{ mb: 3 }}>
          <Tooltip title="Go back">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Back
            </Button>
          </Tooltip>
        </Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          No medical details have been recorded for this appointment yet.
        </Alert>
        {user?.roles?.includes("Admin") && (
          <Tooltip title="Create new appointment details">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/appointments/details/${id}/edit`)}
            >
              Add Details
            </Button>
          </Tooltip>
        )}
      </Container>
    );
  }

  if (!details) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Tooltip title="Go back">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
        </Tooltip>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h3" color="primary" gutterBottom>
              Appointment Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Appointment ID: {details.appointmentId}
            </Typography>
          </Box>
          {user?.roles?.includes("Admin") && (
            <Tooltip title="Edit details">
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/appointments/details/${id}/edit`)}
              >
                Edit
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <DescriptionIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
          <Typography variant="h5" color="primary">
            Medical Information
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {details.notes && (
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Notes
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body1">{details.notes}</Typography>
              </Paper>
            </Box>
          )}

          {details.diagnosis && (
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Diagnosis
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body1">{details.diagnosis}</Typography>
              </Paper>
            </Box>
          )}

          {details.recommendations && (
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Recommendations
              </Typography>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body1">
                  {details.recommendations}
                </Typography>
              </Paper>
            </Box>
          )}

          {!details.notes && !details.diagnosis && !details.recommendations && (
            <Alert severity="info">
              All fields are empty. Click Edit to add information.
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
