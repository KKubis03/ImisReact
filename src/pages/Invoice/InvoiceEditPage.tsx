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
import * as InvoiceService from "../../api/services/invoice.service";
import { PaymentMethodService } from "../../api/services/paymentMethod.service";
import { AxiosError } from "axios";

export default function InvoiceEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [errors, setErrors] = useState({
    issueDate: "",
    dueDate: "",
    paymentMethodId: "",
  });

  const [paymentMethods, setPaymentMethods] = useState<
    { id: number; methodName: string }[]
  >([]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [invoiceRes, paymentMethodsRes] = await Promise.all([
        InvoiceService.getById(Number(id)),
        PaymentMethodService.getAll(),
      ]);

      const invoice = invoiceRes.data;
      setIssueDate(invoice.issueDate.split("T")[0]);
      setDueDate(invoice.dueDate.split("T")[0]);

      // Find the payment method ID by name
      const paymentMethod = paymentMethodsRes.data.find(
        (pm) => pm.methodName === invoice.paymentMethodName,
      );
      setPaymentMethodId(paymentMethod ? paymentMethod.id.toString() : "");

      setPaymentMethods(paymentMethodsRes.data);
    } catch (err) {
      setError("Failed to load invoice data");
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      issueDate: issueDate ? "" : "Issue date is required",
      dueDate: dueDate ? "" : "Due date is required",
      paymentMethodId: paymentMethodId ? "" : "Payment method is required",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await InvoiceService.update({
        id: Number(id),
        issueDate,
        dueDate,
        paymentMethodId: Number(paymentMethodId),
      });

      setSuccess("Invoice updated successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof AxiosError
          ? err.response?.data
          : "Failed to update invoice",
      );
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
          Edit Invoice
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
            label="Issue Date"
            type="date"
            value={issueDate}
            onChange={(e) => {
              setIssueDate(e.target.value);
              setErrors((prev) => ({
                ...prev,
                issueDate: e.target.value ? "" : "Issue date is required",
              }));
            }}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.issueDate}
            helperText={errors.issueDate}
          />

          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              setErrors((prev) => ({
                ...prev,
                dueDate: e.target.value ? "" : "Due date is required",
              }));
            }}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.dueDate}
            helperText={errors.dueDate}
          />

          <TextField
            fullWidth
            select
            label="Payment Method"
            value={paymentMethodId}
            onChange={(e) => {
              setPaymentMethodId(e.target.value);
              setErrors((prev) => ({
                ...prev,
                paymentMethodId: e.target.value
                  ? ""
                  : "Payment method is required",
              }));
            }}
            margin="normal"
            required
            error={!!errors.paymentMethodId}
            helperText={errors.paymentMethodId}
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method.id} value={method.id}>
                {method.methodName}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Tooltip title="Save changes">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Save
              </Button>
            </Tooltip>
            <Tooltip title="Cancel">
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
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
