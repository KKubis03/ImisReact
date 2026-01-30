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
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentIcon from "@mui/icons-material/Payment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import * as InvoiceService from "../../api/services/invoice.service";
import type { Invoice } from "../../api/services/invoice.service";

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const response = await InvoiceService.getAll();
      setInvoices(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setInvoiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (invoiceToDelete === null) return;

    try {
      await InvoiceService.deleteInvoice(invoiceToDelete);
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
      loadInvoices();
    } catch (err) {
      setError("Failed to delete invoice");
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    invoice: Invoice,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  };

  const handlePayInvoice = async (invoiceId: number) => {
    handleMenuClose();
    try {
      await InvoiceService.payInvoice(invoiceId);
      loadInvoices(); // Reload to get updated status
    } catch (err) {
      setError("Failed to mark invoice as paid");
    }
  };

  const handleViewInvoice = (invoiceId: number) => {
    handleMenuClose();
    navigate(`/invoices/${invoiceId}`);
  };

  const handleDeleteInvoice = (invoiceId: number) => {
    handleMenuClose();
    handleDeleteClick(invoiceId);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 10, mb: 6 }}>
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
            Invoices
          </Typography>
          <Typography variant="body1" mt={1}>
            Below is a list of all invoices in the system.
          </Typography>
        </Box>
        <Tooltip title="Create new invoice">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/invoices/add")}
          >
            New Invoice
          </Button>
        </Tooltip>
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
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Status
                    <Tooltip title="View all invoice statuses">
                      <IconButton
                        size="small"
                        onClick={() => navigate("/invoice-statuses")}
                        sx={{ padding: 0.5 }}
                      >
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>Total Gross</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => {
                const issueDate = new Date(
                  invoice.issueDate,
                ).toLocaleDateString();
                const dueDate = new Date(invoice.dueDate).toLocaleDateString();

                return (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{issueDate}</TableCell>
                    <TableCell>{dueDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.statusName}
                        size="small"
                        variant="outlined"
                        color={
                          invoice.statusName === "Paid"
                            ? "success"
                            : invoice.statusName === "Issued"
                              ? "primary"
                              : invoice.statusName === "Cancelled"
                                ? "error"
                                : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {invoice.totalGross.toFixed(2)} {invoice.currency}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuOpen(e, invoice)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
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
        {selectedInvoice && (
          <>
            <MenuItem onClick={() => handleViewInvoice(selectedInvoice.id)}>
              <ListItemIcon>
                <VisibilityIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            {selectedInvoice.statusName === "Draft" && (
              <MenuItem onClick={() => handlePayInvoice(selectedInvoice.id)}>
                <ListItemIcon>
                  <PaymentIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Pay Invoice</ListItemText>
              </MenuItem>
            )}
            {selectedInvoice.statusName === "Draft" && (
              <MenuItem onClick={() => handleDeleteInvoice(selectedInvoice.id)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete Invoice</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this invoice? This action cannot be
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
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
