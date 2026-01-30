import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as InvoiceService from "../../api/services/invoice.service";
import type { Invoice } from "../../api/services/invoice.service";

export default function InvoiceDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInvoice();
  }, [id, location.key]); // Reload when id changes or when navigating to this page

  const loadInvoice = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");
      const response = await InvoiceService.getById(Number(id));
      setInvoice(response.data);
    } catch (err: any) {
      setError("Failed to load invoice details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Tooltip title="Go back">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Tooltip>
      </Container>
    );
  }

  if (!invoice) {
    return null;
  }

  const issueDate = new Date(invoice.issueDate).toLocaleDateString();
  const dueDate = new Date(invoice.dueDate).toLocaleDateString();
  const paymentDate = invoice.paymentDate
    ? new Date(invoice.paymentDate).toLocaleDateString()
    : "-";

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" color="primary" gutterBottom>
          Invoice Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {invoice.invoiceNumber}
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" color="primary">
            Invoice Information
          </Typography>
          {invoice.statusName !== "Paid" && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
            >
              Edit
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Invoice Number
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {invoice.invoiceNumber}
              </Typography>
            </Box>

            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                <Chip
                  color="primary"
                  size="small"
                  variant="outlined"
                  label={invoice.statusName}
                ></Chip>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Issue Date
              </Typography>
              <Typography variant="body1">{issueDate}</Typography>
            </Box>

            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Due Date
              </Typography>
              <Typography variant="body1">{dueDate}</Typography>
            </Box>

            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Payment Date
              </Typography>
              <Typography variant="body1">{paymentDate}</Typography>
            </Box>

            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1">
                {invoice.paymentMethodName}
              </Typography>
            </Box>
          </Box>

          {(invoice.discountName || invoice.discountPercentage > 0) && (
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 45%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Discount
                </Typography>
                <Typography variant="body1">
                  {invoice.discountName || "-"}
                </Typography>
              </Box>

              <Box sx={{ flex: "1 1 45%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Discount Percentage
                </Typography>
                <Typography variant="body1">
                  {invoice.discountPercentage}%
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Seller and Buyer Information */}
      {invoice.invoiceDetails && (
        <Paper sx={{ p: 4, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" color="primary">
              Parties Information
            </Typography>
            {invoice.statusName !== "Paid" && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/invoices/edit-buyer/${invoice.id}`)}
              >
                Edit
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {/* Seller */}
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Seller
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body2">
                    {invoice.invoiceDetails.sellerName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body2">
                    {invoice.invoiceDetails.sellerAddress}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tax ID
                  </Typography>
                  <Typography variant="body2">
                    {invoice.invoiceDetails.sellerTaxId}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bank Account
                  </Typography>
                  <Typography variant="body2">
                    {invoice.invoiceDetails.sellerBankAccount}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bank Name
                  </Typography>
                  <Typography variant="body2">
                    {invoice.invoiceDetails.sellerBankName}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Buyer */}
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Buyer
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body2">
                    {invoice.invoiceDetails.buyerName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body2">
                    {invoice.invoiceDetails.buyerAddress}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tax ID
                  </Typography>
                  <Typography variant="body2">
                    {invoice.invoiceDetails.buyerTaxId || "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Invoice Items */}
      {invoice.items && invoice.items.length > 0 && (
        <Paper sx={{ p: 4, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" color="primary">
              Invoice Items
            </Typography>
            {invoice.statusName !== "Paid" && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(`/invoices/edit-items/${invoice.id}`)}
              >
                Edit
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Item</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Quantity</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Unit</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Unit Price</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>VAT Rate</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Net Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>VAT</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Gross Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.items.map((item) => {
                  const netTotal = item.quantity * item.unitPrice;
                  const vatAmount = netTotal * (item.vatRate / 100);
                  const grossTotal = netTotal + vatAmount;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unit}</TableCell>
                      <TableCell align="right">
                        {item.unitPrice.toFixed(2)} {invoice.currency}
                      </TableCell>
                      <TableCell align="right">{item.vatRate}%</TableCell>
                      <TableCell align="right">
                        {netTotal.toFixed(2)} {invoice.currency}
                      </TableCell>
                      <TableCell align="right">
                        {vatAmount.toFixed(2)} {invoice.currency}
                      </TableCell>
                      <TableCell align="right">
                        {grossTotal.toFixed(2)} {invoice.currency}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Summary */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Summary
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">Total Net:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {invoice.totalNet.toFixed(2)} {invoice.currency}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">Total VAT:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {invoice.totalVat.toFixed(2)} {invoice.currency}
            </Typography>
          </Box>

          {invoice.totalDiscountAmount > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" color="success">
                Discount:
              </Typography>
              <Typography variant="body1" fontWeight="medium" color="success">
                -{invoice.totalDiscountAmount.toFixed(2)} {invoice.currency}
              </Typography>
            </Box>
          )}

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="primary">
              Total Gross:
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {invoice.totalGross.toFixed(2)} {invoice.currency}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
