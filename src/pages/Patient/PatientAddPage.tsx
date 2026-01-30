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
  MenuItem,
  Tooltip,
} from "@mui/material";
import { PatientsService } from "../../api/services/patients.service";
import {
  validateFirstName,
  validateLastName,
  validatePesel,
  validateDateOfBirth,
  validateGender,
  validateEmail,
  validatePhoneNumber,
} from "../../utils/validators";

export default function PatientAddPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pesel, setPesel] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    pesel: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      pesel: validatePesel(pesel),
      dateOfBirth: validateDateOfBirth(dateOfBirth),
      gender: validateGender(gender),
      email: validateEmail(email),
      phoneNumber: validatePhoneNumber(phoneNumber),
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
      await PatientsService.create({
        firstName,
        lastName,
        pesel,
        dateOfBirth,
        gender,
        email,
        phoneNumber,
      });
      setSuccess("Patient created successfully!");
      setTimeout(() => {
        navigate("/patients");
      }, 2000);
    } catch (err) {
      setError("Failed to create patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Add New Patient
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
            label="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrors((prev) => ({
                ...prev,
                firstName: validateFirstName(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
          />

          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors((prev) => ({
                ...prev,
                lastName: validateLastName(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.lastName}
            helperText={errors.lastName}
          />

          <TextField
            fullWidth
            label="PESEL"
            value={pesel}
            onChange={(e) => {
              setPesel(e.target.value);
              setErrors((prev) => ({
                ...prev,
                pesel: validatePesel(e.target.value),
              }));
            }}
            margin="normal"
            inputProps={{ maxLength: 11 }}
            required
            error={!!errors.pesel}
            helperText={errors.pesel}
          />

          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              setErrors((prev) => ({
                ...prev,
                dateOfBirth: validateDateOfBirth(e.target.value),
              }));
            }}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
          />

          <TextField
            fullWidth
            select
            label="Gender"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setErrors((prev) => ({
                ...prev,
                gender: validateGender(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.gender}
            helperText={errors.gender}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({
                ...prev,
                email: validateEmail(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setErrors((prev) => ({
                ...prev,
                phoneNumber: validatePhoneNumber(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
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
                onClick={() => navigate("/patients")}
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
