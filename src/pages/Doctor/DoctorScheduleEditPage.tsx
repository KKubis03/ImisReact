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
  MenuItem,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ScheduleService } from "../../api/services/schedule.service";
import {
  DoctorsService,
  type DoctorListItem,
} from "../../api/services/doctors.service";
import {
  DictionaryService,
  type DayOfWeek,
} from "../../api/services/dictionary.service";

export default function DoctorScheduleEditPage() {
  const navigate = useNavigate();
  const { doctorId, id } = useParams<{ doctorId: string; id: string }>();
  const [dayOfTheWeek, setDayOfTheWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("");
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDurationMinutes, setCustomDurationMinutes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [doctor, setDoctor] = useState<DoctorListItem | null>(null);

  const [errors, setErrors] = useState({
    startTime: "",
    endTime: "",
    slotDuration: "",
  });
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>([]);

  useEffect(() => {
    loadData();
    loadDaysOfWeek();
  }, [id, doctorId]);

  const loadData = async () => {
    if (!id || !doctorId) return;

    try {
      setLoadingData(true);
      const [scheduleResponse, doctorsResponse] = await Promise.all([
        ScheduleService.getById(Number(id)),
        DoctorsService.getAll(),
      ]);

      const schedule = scheduleResponse.data;
      const doctorInfo = doctorsResponse.data.find(
        (d) => d.id === Number(doctorId),
      );

      setDoctor(doctorInfo || null);
      setDayOfTheWeek(String(schedule.dayOfTheWeek));
      setStartTime(schedule.startTime.substring(0, 5));
      setEndTime(schedule.endTime.substring(0, 5));

      // Sprawdź czy to custom duration
      const standardDurations = [
        "00:15:00",
        "00:20:00",
        "00:30:00",
        "00:45:00",
        "01:00:00",
      ];
      if (standardDurations.includes(schedule.slotDuration)) {
        setSlotDuration(schedule.slotDuration);
        setIsCustomDuration(false);
      } else {
        setSlotDuration("custom");
        setIsCustomDuration(true);
        // Konwertuj HH:MM:SS na minuty
        const [hours, minutes] = schedule.slotDuration.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes;
        setCustomDurationMinutes(String(totalMinutes));
      }
    } catch (err) {
      setError("Failed to load schedule");
    } finally {
      setLoadingData(false);
    }
  };

  const loadDaysOfWeek = async () => {
    try {
      const response = await DictionaryService.getDaysOfWeek();
      setDaysOfWeek(response.data);
    } catch (err) {
      setError("Failed to load days of week");
    }
  };

  const validateTime = (start: string, end: string): string => {
    if (!start || !end) return "";
    if (start >= end) return "End time must be after start time";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const timeError = validateTime(startTime, endTime);

    // Walidacja custom duration
    let customDurationError = "";
    if (isCustomDuration) {
      const minutes = Number(customDurationMinutes);
      if (!customDurationMinutes) {
        customDurationError = "Custom duration is required";
      } else if (isNaN(minutes) || minutes <= 0) {
        customDurationError = "Duration must be a positive number";
      } else if (minutes > 240) {
        customDurationError = "Duration cannot exceed 240 minutes";
      }
    }

    const newErrors = {
      startTime: !startTime ? "Start time is required" : timeError,
      endTime: !endTime ? "End time is required" : "",
      slotDuration:
        customDurationError ||
        (!slotDuration && !isCustomDuration ? "Slot duration is required" : ""),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      setError("Please fix all validation errors");
      return;
    }

    // Przygotuj slot duration
    let finalSlotDuration = slotDuration;
    if (isCustomDuration && customDurationMinutes) {
      const minutes = Number(customDurationMinutes);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      finalSlotDuration = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
    }

    try {
      setLoading(true);
      setError("");
      await ScheduleService.update(Number(id), {
        id: Number(id),
        doctorId: Number(doctorId),
        dayOfTheWeek: Number(dayOfTheWeek),
        startTime: startTime + ":00",
        endTime: endTime + ":00",
        slotDuration: finalSlotDuration,
      });
      setSuccess("Schedule updated successfully!");
      setTimeout(() => {
        navigate(`/doctors/${doctorId}/schedule`);
      }, 2000);
    } catch (err) {
      setError("Failed to update schedule");
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
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Edit Schedule for{" "}
          {doctor ? `${doctor.firstName} ${doctor.lastName}` : "Doctor"}
        </Typography>
        {doctor && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {doctor.specializationName} - {doctor.departmentName}
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, mt: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Day of the Week
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {daysOfWeek.find((d) => d.dayOfTheWeek === Number(dayOfTheWeek))
                ?.dayOfTheWeekLabel || "Unknown"}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              const timeError = validateTime(e.target.value, endTime);
              setErrors((prev) => ({
                ...prev,
                startTime: !e.target.value
                  ? "Start time is required"
                  : timeError,
              }));
            }}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.startTime}
            helperText={errors.startTime}
          />

          <TextField
            fullWidth
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
              const timeError = validateTime(startTime, e.target.value);
              setErrors((prev) => ({
                ...prev,
                endTime: !e.target.value ? "End time is required" : "",
                startTime: timeError,
              }));
            }}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.endTime}
            helperText={errors.endTime}
          />

          <TextField
            fullWidth
            select
            label="Slot Duration"
            value={slotDuration}
            onChange={(e) => {
              const value = e.target.value;
              setSlotDuration(value);
              setIsCustomDuration(value === "custom");
              setErrors((prev) => ({
                ...prev,
                slotDuration: !value ? "Slot duration is required" : "",
              }));
            }}
            margin="normal"
            required
            error={!!errors.slotDuration}
            helperText={errors.slotDuration}
          >
            <MenuItem value="00:15:00">15 minutes</MenuItem>
            <MenuItem value="00:20:00">20 minutes</MenuItem>
            <MenuItem value="00:30:00">30 minutes</MenuItem>
            <MenuItem value="00:45:00">45 minutes</MenuItem>
            <MenuItem value="01:00:00">1 hour</MenuItem>
            <MenuItem value="custom">Custom duration...</MenuItem>
          </TextField>

          {isCustomDuration && (
            <TextField
              fullWidth
              label="Custom Duration (minutes)"
              type="number"
              value={customDurationMinutes}
              onChange={(e) => {
                setCustomDurationMinutes(e.target.value);
                const minutes = Number(e.target.value);
                let error = "";
                if (!e.target.value) {
                  error = "Custom duration is required";
                } else if (isNaN(minutes) || minutes <= 0) {
                  error = "Duration must be a positive number";
                } else if (minutes > 240) {
                  error = "Duration cannot exceed 240 minutes";
                }
                setErrors((prev) => ({
                  ...prev,
                  slotDuration: error,
                }));
              }}
              margin="normal"
              required
              error={!!errors.slotDuration}
              helperText={
                errors.slotDuration || "Enter duration in minutes (1-240)"
              }
              inputProps={{ min: 1, max: 240 }}
            />
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Schedule"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/doctors/${doctorId}/schedule`)}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
