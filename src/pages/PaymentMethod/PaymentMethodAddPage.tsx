import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Tooltip,
} from "@mui/material";
import { PaymentMethodService } from "../../api/services/paymentMethod.service";
import { validateName, validateDescription } from "../../utils/validators";

export default function PaymentMethodAddPage() {
  const navigate = useNavigate();
  const [methodName, setMethodName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    methodName: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      methodName: validateName(methodName),
      description: validateDescription(description),
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
      await PaymentMethodService.create({ methodName, description });
      setSuccess("Payment method created successfully!");
      setTimeout(() => {
        navigate("/payment-methods");
      }, 2000);
    } catch (err) {
      setError("Failed to create payment method");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Add New Payment Method
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
            label="Method Name"
            value={methodName}
            onChange={(e) => {
              setMethodName(e.target.value);
              setErrors((prev) => ({
                ...prev,
                methodName: validateName(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.methodName}
            helperText={errors.methodName}
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({
                ...prev,
                description: validateDescription(e.target.value),
              }));
            }}
            margin="normal"
            multiline
            rows={3}
            required
            error={!!errors.description}
            helperText={errors.description}
          />

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
                onClick={() => navigate("/payment-methods")}
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
