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
import { InvoiceStatusService } from "../../api/services/invoiceStatus.service";

export default function InvoiceStatusEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [statusName, setStatusName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadStatus();
  }, [id]);

  const loadStatus = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const response = await InvoiceStatusService.getById(Number(id));
      setStatusName(response.data.statusName);
      setDescription(response.data.description);
    } catch (err) {
      setError("Failed to load invoice status");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!statusName || !description) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await InvoiceStatusService.update(Number(id), {
        id: Number(id),
        statusName,
        description,
      });
      setSuccess("Invoice status updated successfully!");
      setTimeout(() => {
        navigate("/invoice-statuses");
      }, 2000);
    } catch (err) {
      setError("Failed to update invoice status");
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
          Edit Invoice Status
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
            label="Status Name"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
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
                onClick={() => navigate("/invoice-statuses")}
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
