import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  MenuItem,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { AppointmentsService } from "../../api/services/appointments.service";
import { PatientsService } from "../../api/services/patients.service";
import { DoctorsService } from "../../api/services/doctors.service";
import { ScheduleService } from "../../api/services/schedule.service";
import { AppointmentTypeService } from "../../api/services/appointmentType.service";
import {
  validatePatientId,
  validateDoctorId,
  validateAppointmentDate,
  validateAppointmentTime,
} from "../../utils/validators";

export default function AppointmentAddPage() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentTypeId, setAppointmentTypeId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    patientId: "",
    doctorId: "",
    appointmentTypeId: "",
    date: "",
    time: "",
  });

  const [patients, setPatients] = useState<
    { id: number; fullName: string; pesel: string }[]
  >([]);
  const [doctors, setDoctors] = useState<
    { id: number; fullName: string; departmentName: string }[]
  >([]);
  const [appointmentTypes, setAppointmentTypes] = useState<
    { id: number; name: string; description: string }[]
  >([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if (doctorId && date) {
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
      setTime("");
    }
  }, [doctorId, date]);

  const loadOptions = async () => {
    try {
      setLoadingData(true);
      const [patientsRes, doctorsRes, appointmentTypesRes] = await Promise.all([
        PatientsService.getSelectList(),
        DoctorsService.getSelectList(),
        AppointmentTypeService.getAll(),
      ]);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setAppointmentTypes(appointmentTypesRes.data);
    } catch (err) {
      setError("Failed to load form options");
    } finally {
      setLoadingData(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      // Format date to dd.MM.yyyy for API
      const dateObj = new Date(date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      const response = await ScheduleService.getAvailableSlots(
        Number(doctorId),
        formattedDate
      );
      setAvailableSlots(response.data);
      setTime(""); // Reset time when slots change
    } catch (err) {
      setError("Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      patientId: validatePatientId(patientId),
      doctorId: validateDoctorId(doctorId),
      appointmentTypeId: appointmentTypeId
        ? ""
        : "Appointment type is required",
      date: validateAppointmentDate(date),
      time: validateAppointmentTime(time),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Combine date and time into ISO format
      const appointmentDateTime = `${date}T${time}:00`;

      await AppointmentsService.create({
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        appointmentTypeId: Number(appointmentTypeId),
        appointmentDate: appointmentDateTime,
      });
      setSuccess("Appointment created successfully!");
      setTimeout(() => {
        navigate("/appointments");
      }, 2000);
    } catch (err) {
      setError("Failed to create appointment");
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
          Add New Appointment
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
            select
            label="Patient"
            value={patientId}
            onChange={(e) => {
              setPatientId(e.target.value);
              setErrors((prev) => ({
                ...prev,
                patientId: validatePatientId(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.patientId}
            helperText={errors.patientId}
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.fullName} - {patient.pesel}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Doctor"
            value={doctorId}
            onChange={(e) => {
              setDoctorId(e.target.value);
              setErrors((prev) => ({
                ...prev,
                doctorId: validateDoctorId(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.doctorId}
            helperText={errors.doctorId}
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.fullName} - {doctor.departmentName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Appointment Type"
            value={appointmentTypeId}
            onChange={(e) => {
              setAppointmentTypeId(e.target.value);
              setErrors((prev) => ({
                ...prev,
                appointmentTypeId: e.target.value
                  ? ""
                  : "Appointment type is required",
              }));
            }}
            margin="normal"
            required
            error={!!errors.appointmentTypeId}
            helperText={errors.appointmentTypeId}
          >
            {appointmentTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Appointment Date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setErrors((prev) => ({
                ...prev,
                date: validateAppointmentDate(e.target.value),
              }));
            }}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.date}
            helperText={errors.date}
          />

          <TextField
            fullWidth
            select
            label="Appointment Time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setErrors((prev) => ({
                ...prev,
                time: validateAppointmentTime(e.target.value),
              }));
            }}
            margin="normal"
            required
            disabled={!doctorId || !date || loadingSlots}
            error={!!errors.time}
            helperText={
              errors.time ||
              (!doctorId || !date
                ? "Please select doctor and date first"
                : loadingSlots
                ? "Loading available times..."
                : availableSlots.length === 0
                ? "No available time slots"
                : "")
            }
          >
            {availableSlots.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot}
              </MenuItem>
            ))}
          </TextField>

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
                onClick={() => navigate("/appointments")}
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
