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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import {
  PatientsService,
  type Patient,
} from "../../api/services/patients.service";
import {
  AppointmentsService,
  type Appointment,
} from "../../api/services/appointments.service";
import { useAuth } from "../../contexts/AuthContext";

export default function PatientProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatientData();
  }, [id, user]);

  const loadPatientData = async () => {
    // Jeśli jesteśmy w panelu pacjenta i nie ma ID w URL, używamy patientId z user
    const patientId = id || (user?.patientId ? String(user.patientId) : null);

    if (!patientId) {
      setError("Invalid patient ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const patientResponse = await PatientsService.getById(
        parseInt(patientId)
      );
      setPatient(patientResponse.data);

      // Load patient appointments (you may need to add this endpoint to your API)
      try {
        // Assuming there's an endpoint to get appointments by patient ID
        // If not available, you can skip this part
        const appointmentsResponse = await AppointmentsService.getAll();
        const patientAppointments = appointmentsResponse.data.filter(
          (apt) => apt.patientId === parseInt(patientId)
        );
        setAppointments(patientAppointments);
      } catch (err) {
        console.log("Failed to load appointments");
      }

      setError("");
    } catch (err) {
      setError("Failed to load patient data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "planned":
        return "primary";
      case "completed":
        return "success";
      case "in progress":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 10, mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="xl" sx={{ mt: 10, mb: 6 }}>
        <Alert severity="error">Patient not found</Alert>
        <Tooltip title="Go back">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Back
          </Button>
        </Tooltip>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 10, mb: 6 }}>
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
          <Typography variant="h3" color="primary">
            Patient Profile
          </Typography>
          {user?.roles?.includes("Admin") && (
            <Tooltip title="Edit details">
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/patients/edit/${patient.id}`)}
              >
                Edit Patient
              </Button>
            </Tooltip>
          )}
          {user?.roles?.includes("Patient") &&
            user.patientId === patient.id && (
              <Tooltip title="Edit details">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/patient/profile/edit`)}
                >
                  Edit
                </Button>
              </Tooltip>
            )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Personal Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Personal Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {patient.firstName} {patient.lastName}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  PESEL
                </Typography>
                <Typography variant="body1">{patient.pesel}</Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography variant="body1">
                  {formatDate(patient.dateOfBirth)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Gender
                </Typography>
                <Typography variant="body1">{patient.gender}</Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{patient.email}</Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">{patient.phoneNumber}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Appointments History */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Appointments History
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {appointments.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No appointments found for this patient.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments
                  .sort(
                    (a, b) =>
                      new Date(b.appointmentDate).getTime() -
                      new Date(a.appointmentDate).getTime()
                  )
                  .map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {formatDateTime(appointment.appointmentDate)}
                      </TableCell>
                      <TableCell>
                        Dr. {appointment.doctorName} {appointment.doctorSurname}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.appointmentStatusName}
                          color={getStatusColor(
                            appointment.appointmentStatusName
                          )}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <Button
                            size="small"
                            onClick={() => {
                              const path = user?.roles?.includes("Admin")
                                ? `/appointments/details/${appointment.id}`
                                : `/doctor/appointments/details/${appointment.id}`;
                              navigate(path);
                            }}
                          >
                            View Details
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}
