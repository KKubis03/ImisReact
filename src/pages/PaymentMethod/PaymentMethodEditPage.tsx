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
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { PaymentMethodService } from "../../api/services/paymentMethod.service";

export default function PaymentMethodEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [methodName, setMethodName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadMethod();
  }, [id]);

  const loadMethod = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const response = await PaymentMethodService.getById(Number(id));
      setMethodName(response.data.methodName);
      setDescription(response.data.description);
    } catch (err) {
      setError("Failed to load payment method");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!methodName || !description) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await PaymentMethodService.update(Number(id), {
        id: Number(id),
        methodName,
        description,
      });
      setSuccess("Payment method updated successfully!");
      setTimeout(() => {
        navigate("/payment-methods");
      }, 2000);
    } catch (err) {
      setError("Failed to update payment method");
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
          Edit Payment Method
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
            onChange={(e) => setMethodName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            required
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
