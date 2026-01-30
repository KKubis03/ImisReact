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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  ScheduleService,
  type ScheduleListItem,
} from "../../api/services/schedule.service";
import { useAuth } from "../../contexts/AuthContext";
import {
  DictionaryService,
  type DayOfWeek,
} from "../../api/services/dictionary.service";

export default function MyScheduleAddPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dayOfTheWeek, setDayOfTheWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("00:30:00");
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDurationMinutes, setCustomDurationMinutes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingSchedules, setExistingSchedules] = useState<
    ScheduleListItem[]
  >([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>([]);

  const [errors, setErrors] = useState({
    dayOfTheWeek: "",
    startTime: "",
    endTime: "",
    slotDuration: "",
  });

  useEffect(() => {
    loadExistingSchedules();
    loadDaysOfWeek();
  }, [user]);

  const loadExistingSchedules = async () => {
    if (!user?.doctorId) {
      setLoadingSchedules(false);
      return;
    }

    try {
      const response = await ScheduleService.getByDoctorId(user.doctorId);
      setExistingSchedules(response.data);
    } catch (err) {
      console.error("Failed to load schedules", err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const loadDaysOfWeek = async () => {
    try {
      const response = await DictionaryService.getDaysOfWeek();
      setDaysOfWeek(response.data);
    } catch (err) {
      console.error("Failed to load days of week", err);
    }
  };

  const validateTime = (start: string, end: string): string => {
    if (!start || !end) return "";
    if (start >= end) return "End time must be later than start time";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.doctorId) {
      setError("Doctor ID not found");
      return;
    }

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
      dayOfTheWeek: dayOfTheWeek === "" ? "Day of the Week is required" : "",
      startTime: !startTime ? "Start time is required" : timeError,
      endTime: !endTime ? "End time is required" : "",
      slotDuration:
        customDurationError ||
        (!slotDuration && !isCustomDuration ? "Slot duration is required" : ""),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      setError("Please correct all validation errors");
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
      await ScheduleService.create({
        doctorId: user.doctorId,
        dayOfTheWeek: Number(dayOfTheWeek),
        startTime: startTime + ":00",
        endTime: endTime + ":00",
        slotDuration: finalSlotDuration,
      });
      setSuccess("Schedule added successfully!");
      setTimeout(() => {
        navigate("/doctor/schedule");
      }, 2000);
    } catch (err) {
      setError("Failed to add schedule");
    } finally {
      setLoading(false);
    }
  };

  if (loadingSchedules) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Filter days that are already in the schedule
  const availableDays = daysOfWeek.filter((day) => {
    const exists = existingSchedules.some((s) => {
      // Convert to number if API returns string
      const scheduleDayOfWeek =
        typeof s.dayOfTheWeek === "string"
          ? parseInt(s.dayOfTheWeek)
          : s.dayOfTheWeek;
      return scheduleDayOfWeek === day.dayOfTheWeek;
    });
    return !exists;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Add New Schedule
        </Typography>

        {availableDays.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Schedule has been defined for all days of the week. To add a new
            entry, first delete the existing schedule for the selected day.
          </Alert>
        ) : (
          <>
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
                select
                fullWidth
                label="Day of the Week"
                value={dayOfTheWeek}
                onChange={(e) => {
                  setDayOfTheWeek(e.target.value);
                  setErrors({ ...errors, dayOfTheWeek: "" });
                }}
                error={!!errors.dayOfTheWeek}
                helperText={errors.dayOfTheWeek}
                sx={{ mb: 3 }}
              >
                {availableDays.map((day) => (
                  <MenuItem key={day.dayOfTheWeek} value={day.dayOfTheWeek}>
                    {day.dayOfTheWeekLabel}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                type="time"
                label="Start Time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setErrors({ ...errors, startTime: "" });
                }}
                error={!!errors.startTime}
                helperText={errors.startTime}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                type="time"
                label="End Time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setErrors({ ...errors, endTime: "" });
                }}
                error={!!errors.endTime}
                helperText={errors.endTime}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
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
                  setErrors({ ...errors, slotDuration: "" });
                }}
                error={!!errors.slotDuration}
                helperText={errors.slotDuration}
                sx={{ mb: 3 }}
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
                    setErrors({ ...errors, slotDuration: error });
                  }}
                  error={!!errors.slotDuration}
                  helperText={
                    errors.slotDuration || "Enter duration in minutes (1-240)"
                  }
                  inputProps={{ min: 1, max: 240 }}
                  sx={{ mb: 3 }}
                />
              )}

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/doctor/schedule")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Add Schedule"}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}
