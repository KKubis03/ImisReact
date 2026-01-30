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
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  DiscountsService,
  type Discount,
} from "../../api/services/discounts.service";

export default function DiscountPage() {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadDiscounts();
  }, [searchTerm]);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const url = searchTerm
        ? `/discount?search=${encodeURIComponent(searchTerm)}`
        : "/discount";
      const response = await DiscountsService.getAll(url);
      setDiscounts(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load discounts");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDiscountToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (discountToDelete === null) return;

    try {
      await DiscountsService.delete(discountToDelete);
      setDeleteDialogOpen(false);
      setDiscountToDelete(null);
      loadDiscounts();
    } catch (err) {
      setError("Failed to delete discount");
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDiscountToDelete(null);
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
            Discounts
          </Typography>
          <Typography variant="body1" mt={1}>
            Below is a list of all discounts in the system.
          </Typography>
        </Box>
        <Tooltip title="Create new discount">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/discount/add")}
          >
            New Discount
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
          placeholder="Search discounts by Name"
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
                <TableCell>Percentage</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>{discount.name}</TableCell>
                  <TableCell>{discount.percentage}%</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(discount.id)}
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
            Are you sure you want to delete this discount? This action cannot be
            undone.
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
