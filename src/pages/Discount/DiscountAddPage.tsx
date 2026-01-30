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
import { DiscountsService } from "../../api/services/discounts.service";
import { validateName, validatePercentage } from "../../utils/validators";

export default function DiscountAddPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    percentage: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      percentage: validatePercentage(percentage),
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
      await DiscountsService.create({
        name,
        percentage: Number(percentage),
      });
      setSuccess("Discount created successfully!");
      setTimeout(() => {
        navigate("/discount");
      }, 2000);
    } catch (err) {
      setError("Failed to create discount");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Add New Discount
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
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({
                ...prev,
                name: validateName(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            label="Percentage"
            type="number"
            value={percentage}
            onChange={(e) => {
              setPercentage(e.target.value);
              setErrors((prev) => ({
                ...prev,
                percentage: validatePercentage(e.target.value),
              }));
            }}
            margin="normal"
            inputProps={{ min: 0, max: 100, step: 1 }}
            required
            error={!!errors.percentage}
            helperText={errors.percentage}
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
                onClick={() => navigate("/discount")}
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
