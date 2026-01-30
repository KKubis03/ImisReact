import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { DiscountsService } from "../../api/services/discounts.service";
import { PaymentMethodService } from "../../api/services/paymentMethod.service";

export default function InvoiceAddByAppointmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentId = location.state?.appointmentId?.toString() || "";

  // Ustaw domyślne daty
  const today = new Date();
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);

  const [discountId, setDiscountId] = useState("");
  const [issueDate, setIssueDate] = useState(today.toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    twoWeeksLater.toISOString().split("T")[0],
  );
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [currency, setCurrency] = useState("PLN");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [errors, setErrors] = useState({
    issueDate: "",
    dueDate: "",
    paymentMethodId: "",
    currency: "",
  });

  const [discounts, setDiscounts] = useState<
    { id: number; name: string; percentage: number }[]
  >([]);
  const [paymentMethods, setPaymentMethods] = useState<
    { id: number; methodName: string }[]
  >([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setLoadingData(true);
      const [discountsRes, paymentMethodsRes] = await Promise.all([
        DiscountsService.getAll(),
        PaymentMethodService.getAll(),
      ]);
      setDiscounts(discountsRes.data);
      setPaymentMethods(paymentMethodsRes.data);
    } catch (err) {
      setError("Failed to load form options");
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      issueDate: issueDate ? "" : "Issue date is required",
      dueDate: dueDate ? "" : "Due date is required",
      paymentMethodId: paymentMethodId ? "" : "Payment method is required",
      currency: currency ? "" : "Currency is required",
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

      await InvoiceService.createFromAppointment({
        appointmentId: appointmentId ? Number(appointmentId) : undefined,
        discountId: discountId ? Number(discountId) : undefined,
        issueDate,
        dueDate,
        paymentMethodId: Number(paymentMethodId),
        currency,
      });

      setSuccess("Invoice created successfully!");
      setTimeout(() => {
        navigate("/invoices");
      }, 2000);
    } catch (err) {
      setError("Failed to create invoice");
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
          Add New Invoice
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

          <TextField
            fullWidth
            select
            label="Currency"
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              setErrors((prev) => ({
                ...prev,
                currency: e.target.value ? "" : "Currency is required",
              }));
            }}
            margin="normal"
            required
            error={!!errors.currency}
            helperText={errors.currency}
          >
            <MenuItem value="PLN">PLN (Polish Zloty)</MenuItem>
            <MenuItem value="EUR">EUR (Euro)</MenuItem>
            <MenuItem value="USD">USD (US Dollar)</MenuItem>
            <MenuItem value="GBP">GBP (British Pound)</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="Discount (Optional)"
            value={discountId}
            onChange={(e) => setDiscountId(e.target.value)}
            margin="normal"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {discounts.map((discount) => (
              <MenuItem key={discount.id} value={discount.id}>
                {discount.name} ({discount.percentage}%)
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
