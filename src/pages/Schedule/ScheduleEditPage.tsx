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
  Tooltip,
} from "@mui/material";
import { ScheduleService } from "../../api/services/schedule.service";
import { DoctorsService } from "../../api/services/doctors.service";
import {
  DictionaryService,
  type DayOfWeek,
} from "../../api/services/dictionary.service";

export default function ScheduleEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [doctorId, setDoctorId] = useState("");
  const [dayOfTheWeek, setDayOfTheWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [doctors, setDoctors] = useState<
    { id: number; fullName: string; departmentName: string }[]
  >([]);
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>([]);

  const [errors, setErrors] = useState({
    doctorId: "",
    dayOfTheWeek: "",
    startTime: "",
    endTime: "",
    slotDuration: "",
  });

  useEffect(() => {
    loadData();
    loadDaysOfWeek();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const [scheduleRes, doctorsRes] = await Promise.all([
        ScheduleService.getById(Number(id)),
        DoctorsService.getSelectList(),
      ]);

      const schedule = scheduleRes.data;
      setDoctorId(String(schedule.doctorId));
      setDayOfTheWeek(String(schedule.dayOfTheWeek));
      // Remove seconds from time strings
      setStartTime(schedule.startTime.substring(0, 5));
      setEndTime(schedule.endTime.substring(0, 5));
      setSlotDuration(schedule.slotDuration);

      setDoctors(doctorsRes.data);
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

    const newErrors = {
      doctorId: !doctorId ? "Doctor is required" : "",
      dayOfTheWeek: dayOfTheWeek === "" ? "Day of the week is required" : "",
      startTime: !startTime ? "Start time is required" : timeError,
      endTime: !endTime ? "End time is required" : "",
      slotDuration: !slotDuration ? "Slot duration is required" : "",
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
      await ScheduleService.update(Number(id), {
        id: Number(id),
        doctorId: Number(doctorId),
        dayOfTheWeek: Number(dayOfTheWeek),
        startTime: startTime + ":00",
        endTime: endTime + ":00",
        slotDuration: slotDuration,
      });
      setSuccess("Schedule updated successfully!");
      setTimeout(() => {
        navigate("/schedules");
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
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Edit Schedule
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
            label="Doctor"
            value={doctorId}
            onChange={(e) => {
              setDoctorId(e.target.value);
              setErrors((prev) => ({
                ...prev,
                doctorId: !e.target.value ? "Doctor is required" : "",
              }));
            }}
            margin="normal"
            required
            error={!!errors.doctorId}
            helperText={errors.doctorId}
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={String(doctor.id)}>
                {doctor.fullName} - {doctor.departmentName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Day of the Week"
            value={dayOfTheWeek}
            onChange={(e) => {
              setDayOfTheWeek(e.target.value);
              setErrors((prev) => ({
                ...prev,
                dayOfTheWeek: !e.target.value
                  ? "Day of the week is required"
                  : "",
              }));
            }}
            margin="normal"
            required
            error={!!errors.dayOfTheWeek}
            helperText={errors.dayOfTheWeek}
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day.dayOfTheWeek} value={String(day.dayOfTheWeek)}>
                {day.dayOfTheWeekLabel}
              </MenuItem>
            ))}
          </TextField>

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
              setSlotDuration(e.target.value);
              setErrors((prev) => ({
                ...prev,
                slotDuration: !e.target.value
                  ? "Slot duration is required"
                  : "",
              }));
            }}
            margin="normal"
            required
            error={!!errors.slotDuration}
            helperText={errors.slotDuration}
          >
            <MenuItem value="00:15:00">15 minutes</MenuItem>
            <MenuItem value="00:30:00">30 minutes</MenuItem>
            <MenuItem value="00:45:00">45 minutes</MenuItem>
            <MenuItem value="01:00:00">1 hour</MenuItem>
          </TextField>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Tooltip title="Save changes">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Tooltip>
            <Tooltip title="Cancel">
              <Button
                variant="outlined"
                onClick={() => navigate("/schedules")}
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
