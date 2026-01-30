import { useState, useEffect } from "react";
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
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { PriceListService } from "../../api/services/priceList.service";
import {
  AppointmentTypeService,
  type AppointmentType,
} from "../../api/services/appointmentType.service";

export default function PriceListAddPage() {
  const navigate = useNavigate();
  const [appointmentTypeId, setAppointmentTypeId] = useState<number>(0);
  const [price, setPrice] = useState("");
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(
    []
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [errors, setErrors] = useState({
    appointmentTypeId: "",
    price: "",
  });

  useEffect(() => {
    loadAppointmentTypes();
  }, []);

  const loadAppointmentTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await AppointmentTypeService.getAll();
      setAppointmentTypes(response.data);
    } catch (err) {
      setError("Failed to load appointment types");
    } finally {
      setLoadingTypes(false);
    }
  };

  const validatePrice = (value: string): string => {
    const numValue = parseFloat(value);
    if (!value) return "Price is required";
    if (isNaN(numValue)) return "Price must be a valid number";
    if (numValue <= 0) return "Price must be greater than 0";
    return "";
  };

  const validateAppointmentType = (value: number): string => {
    if (!value || value === 0) return "Appointment type is required";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      appointmentTypeId: validateAppointmentType(appointmentTypeId),
      price: validatePrice(price),
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
      await PriceListService.create({
        appointmentTypeId,
        price: parseFloat(price),
      });
      setSuccess("Price list item created successfully!");
      setTimeout(() => {
        navigate("/pricelist");
      }, 2000);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create price list item");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingTypes) {
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
          Add New Price
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
            select
            label="Appointment Type"
            value={appointmentTypeId}
            onChange={(e) => {
              const value = Number(e.target.value);
              setAppointmentTypeId(value);
              setErrors((prev) => ({
                ...prev,
                appointmentTypeId: validateAppointmentType(value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.appointmentTypeId}
            helperText={errors.appointmentTypeId}
          >
            <MenuItem value={0} disabled>
              Select appointment type
            </MenuItem>
            {appointmentTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Price"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors((prev) => ({
                ...prev,
                price: validatePrice(e.target.value),
              }));
            }}
            margin="normal"
            required
            type="number"
            inputProps={{ step: "0.01", min: "0" }}
            error={!!errors.price}
            helperText={errors.price}
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Tooltip title="Save new price list item">
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
                onClick={() => navigate("/pricelist")}
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
