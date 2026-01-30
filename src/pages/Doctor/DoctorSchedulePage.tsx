import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  ScheduleService,
  type ScheduleListItem,
} from "../../api/services/schedule.service";
import {
  DoctorsService,
  type DoctorListItem,
} from "../../api/services/doctors.service";

export default function DoctorSchedulePage() {
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId: string }>();
  const [schedules, setSchedules] = useState<ScheduleListItem[]>([]);
  const [doctor, setDoctor] = useState<DoctorListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [doctorId]);

  const loadData = async () => {
    if (!doctorId) return;

    try {
      setLoading(true);
      const [schedulesRes, doctorsRes] = await Promise.all([
        ScheduleService.getByDoctorId(Number(doctorId)),
        DoctorsService.getAll(),
      ]);

      setSchedules(schedulesRes.data);

      // Find doctor info
      const doctorInfo = doctorsRes.data.find((d) => d.id === Number(doctorId));
      setDoctor(doctorInfo || null);

      setError("");
    } catch (err) {
      setError("Failed to load schedules");
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
      loadData();
    } catch (err) {
      setError("Failed to delete schedule");
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setScheduleToDelete(null);
  };

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
          <Box>
            <Typography variant="h3" color="primary">
              Schedule for{" "}
              {doctor ? (
                <Box
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {doctor.firstName} {doctor.lastName}
                </Box>
              ) : (
                "Doctor"
              )}
            </Typography>
            <Typography variant="body1" mt={1}>
              {doctor &&
                `${doctor.specializationName} - ${doctor.departmentName}`}
            </Typography>
          </Box>
          <Tooltip title="Create new schedule">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/doctors/${doctorId}/schedule/add`)}
            >
              Add Schedule
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : schedules.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No schedules found for this doctor
          </Typography>
          <Tooltip title="Create new schedule">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/doctors/${doctorId}/schedule/add`)}
              sx={{ mt: 2 }}
            >
              Add First Schedule
            </Button>
          </Tooltip>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day of Week</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Slot Duration</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.dayOfTheWeekLabel}</TableCell>
                  <TableCell>{schedule.startTime}</TableCell>
                  <TableCell>{schedule.endTime}</TableCell>
                  <TableCell>{schedule.slotDuration}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/doctors/${doctorId}/schedule/edit/${schedule.id}`,
                          )
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
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this schedule? This action cannot be
            undone.
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
