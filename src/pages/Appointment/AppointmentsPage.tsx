import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AppointmentsService,
  type Appointment,
} from "../../api/services/appointments.service";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArticleIcon from "@mui/icons-material/Article";

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(
    null,
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 100)); // 0.1 second delay
      const response = await AppointmentsService.getAll();
      setAppointments(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setAppointmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (appointmentToDelete === null) return;

    try {
      await AppointmentsService.delete(appointmentToDelete);
      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
      loadAppointments();
    } catch (err) {
      setError("Failed to delete appointment");
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    appointment: Appointment,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleViewDetails = (appointmentId: number) => {
    handleMenuClose();
    navigate(`/appointments/details/${appointmentId}`);
  };

  const handleViewInvoice = (invoiceId: number) => {
    handleMenuClose();
    navigate(`/invoices/${invoiceId}`);
  };

  const handleCreateInvoice = (appointmentId: number) => {
    handleMenuClose();
    navigate(`/invoices/add-by-appointment`, {
      state: { appointmentId },
    });
  };

  const handleEditAppointment = (appointmentId: number) => {
    handleMenuClose();
    navigate(`/appointments/edit/${appointmentId}`);
  };

  const handleDeleteAppointment = (appointmentId: number) => {
    handleMenuClose();
    handleDeleteClick(appointmentId);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h3" color="primary">
            Appointments
          </Typography>
          <Typography variant="body1" mt={1}>
            Below is a list of all appointments in the system.
          </Typography>
        </Box>
        <Tooltip title="Create new appointment">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/appointments/add")}
          >
            New Appointment
          </Button>
        </Tooltip>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Status
                    <Tooltip title="View all appointment statuses">
                      <IconButton
                        size="small"
                        onClick={() => navigate("/appointment-statuses")}
                        sx={{ padding: 0.5 }}
                      >
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Status
                    <Tooltip title="View all appointment statuses">
                      <IconButton
                        size="small"
                        onClick={() => navigate("/appointment-statuses")}
                        sx={{ padding: 0.5 }}
                      >
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => {
                const dateTime = new Date(appointment.appointmentDate);
                const date = dateTime.toLocaleDateString();
                const time = dateTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <TableRow key={appointment.id}>
                    <TableCell>{`${appointment.patientName} ${appointment.patientSurname}`}</TableCell>
                    <TableCell>{`${appointment.doctorName} ${appointment.doctorSurname}`}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{time}</TableCell>
                    <TableCell>{appointment.appointmentTypeName}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={appointment.appointmentStatusName}
                      ></Chip>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, appointment)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedAppointment && (
          <>
            <MenuItem onClick={() => handleViewDetails(selectedAppointment.id)}>
              <ListItemIcon>
                <InfoOutlinedIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>
                {selectedAppointment.hasDetails
                  ? "View Details"
                  : "Add Details"}
              </ListItemText>
            </MenuItem>
            {selectedAppointment.invoiceId ? (
              <MenuItem
                onClick={() =>
                  handleViewInvoice(selectedAppointment.invoiceId!)
                }
              >
                <ListItemIcon>
                  <ArticleIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>View Invoice</ListItemText>
              </MenuItem>
            ) : (
              selectedAppointment.appointmentStatusName === "Completed" && (
                <MenuItem
                  onClick={() => handleCreateInvoice(selectedAppointment.id)}
                >
                  <ListItemIcon>
                    <ArticleIcon fontSize="small" color="secondary" />
                  </ListItemIcon>
                  <ListItemText>Create Invoice</ListItemText>
                </MenuItem>
              )
            )}
            {selectedAppointment.appointmentStatusName === "Planned" && (
              <MenuItem
                onClick={() => handleEditAppointment(selectedAppointment.id)}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>Edit Appointment</ListItemText>
              </MenuItem>
            )}
            {selectedAppointment.appointmentStatusName === "Planned" && (
              <MenuItem
                onClick={() => handleDeleteAppointment(selectedAppointment.id)}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete Appointment</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this appointment? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Tooltip title="Cancel">
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
          </Tooltip>
          <Tooltip title="Delete this item">
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
