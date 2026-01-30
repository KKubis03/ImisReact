import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../contexts/AuthContext";
import {
  ScheduleService,
  type ScheduleListItem,
} from "../../api/services/schedule.service";

export default function MySchedulePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ScheduleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadSchedule();
  }, [user]);

  const loadSchedule = async () => {
    if (!user?.doctorId) {
      setError("Doctor ID not found for the logged-in user");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await ScheduleService.getByDoctorId(user.doctorId);
      setSchedules(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load schedule");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (scheduleToDelete === null) return;

    try {
      await ScheduleService.delete(scheduleToDelete);
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
      loadSchedule();
    } catch (err) {
      setError("Failed to delete schedule");
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setScheduleToDelete(null);
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatDuration = (duration: string) => {
    const parts = duration.split(":");
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h3" component="h1" color="primary">
            My Schedule
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your work schedule
          </Typography>
        </Box>
        <Tooltip title="Create new schedule">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/doctor/schedule/add")}
          >
            Add Schedule
          </Button>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {schedules.length === 0 && !error ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You have not defined any schedules yet.
          </Typography>
          <Tooltip title="Create new schedule">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/doctor/schedule/add")}
              sx={{ mt: 2 }}
            >
              Add Your First Schedule
            </Button>
          </Tooltip>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Day of the Week</strong>
                </TableCell>
                <TableCell>
                  <strong>Start Time</strong>
                </TableCell>
                <TableCell>
                  <strong>End Time</strong>
                </TableCell>
                <TableCell>
                  <strong>Slot Duration</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <Chip
                      label={schedule.dayOfTheWeekLabel}
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatTime(schedule.startTime)}</TableCell>
                  <TableCell>{formatTime(schedule.endTime)}</TableCell>
                  <TableCell>{formatDuration(schedule.slotDuration)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/doctor/schedule/edit/${schedule.id}`)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(schedule.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this schedule? This action is
            irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Tooltip title="Cancel">
            <Button onClick={handleDeleteCancel}>Cancel</Button>
          </Tooltip>
          <Tooltip title="Delete this item">
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
