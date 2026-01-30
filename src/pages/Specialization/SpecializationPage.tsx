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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  SpecializationsService,
  type Specialization,
} from "../../api/services/specializations.service";

export default function SpecializationPage() {
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specializationToDelete, setSpecializationToDelete] = useState<
    number | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSpecializations();
  }, [searchTerm]);

  const loadSpecializations = async () => {
    try {
      setLoading(true);
      const url = searchTerm
        ? `/specialization?search=${encodeURIComponent(searchTerm)}`
        : "/specialization";
      const response = await SpecializationsService.getAll(url);
      setSpecializations(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load specializations");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSpecializationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (specializationToDelete === null) return;

    try {
      await SpecializationsService.delete(specializationToDelete);
      setDeleteDialogOpen(false);
      setSpecializationToDelete(null);
      loadSpecializations();
    } catch (err) {
      setError("Failed to delete specialization");
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSpecializationToDelete(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
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
            Specializations
          </Typography>
          <Typography variant="body1" mt={1}>
            Below is a list of all specializations in the system.
          </Typography>
        </Box>
        <Tooltip title="Create new specialization">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/specializations/add")}
          >
            New Specialization
          </Button>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search specializations by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specializations.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell>{spec.name}</TableCell>
                  <TableCell>{spec.description}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/specializations/edit/${spec.id}`)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(spec.id)}
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
            Are you sure you want to delete this specialization? This action
            cannot be undone.
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
