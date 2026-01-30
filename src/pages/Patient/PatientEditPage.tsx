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
  MenuItem,
  Tooltip,
} from "@mui/material";
import { PatientsService } from "../../api/services/patients.service";
import { useAuth } from "../../contexts/AuthContext";
import {
  validateFirstName,
  validateLastName,
  validatePesel,
  validateDateOfBirth,
  validateGender,
  validateEmail,
  validatePhoneNumber,
} from "../../utils/validators";

export default function PatientEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
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
  const [loadingData, setLoadingData] = useState(true);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    pesel: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    loadPatient();
  }, [id, user]);

  const loadPatient = async () => {
    // Jeśli jesteśmy w panelu pacjenta i nie ma ID w URL, używamy patientId z user
    const patientId = id || (user?.patientId ? String(user.patientId) : null);

    if (!patientId) {
      setError("Invalid patient ID");
      setLoadingData(false);
      return;
    }

    // Sprawdź czy pacjent próbuje edytować własny profil
    if (
      !id &&
      user?.roles?.includes("Patient") &&
      user.patientId !== Number(patientId)
    ) {
      setError("You can only edit your own profile");
      setLoadingData(false);
      return;
    }

    // Sprawdź czy pacjent z ID próbuje edytować inny profil (gdy ma ID w URL)
    if (
      id &&
      user?.roles?.includes("Patient") &&
      user.patientId !== Number(id)
    ) {
      setError("You can only edit your own profile");
      setLoadingData(false);
      return;
    }

    try {
      setLoadingData(true);
      const response = await PatientsService.getById(Number(patientId));
      const patient = response.data;
      setFirstName(patient.firstName);
      setLastName(patient.lastName);
      setPesel(patient.pesel);
      setDateOfBirth(patient.dateOfBirth);
      setGender(patient.gender);
      setEmail(patient.email);
      setPhoneNumber(patient.phoneNumber);
    } catch (err) {
      setError("Failed to load patient");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Określ ID pacjenta do aktualizacji
    const patientId = id || (user?.patientId ? String(user.patientId) : null);

    if (!patientId) {
      setError("Invalid patient ID");
      return;
    }

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
      await PatientsService.update(Number(patientId), {
        id: Number(patientId),
        firstName,
        lastName,
        pesel,
        dateOfBirth,
        gender,
        email,
        phoneNumber,
      });
      setSuccess("Patient updated successfully!");
      setTimeout(() => {
        // Nawigacja zależna od roli
        if (user?.roles?.includes("Patient")) {
          navigate("/patient/profile");
        } else {
          navigate("/patients");
        }
      }, 2000);
    } catch (err) {
      setError("Failed to update patient");
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
          {user?.roles?.includes("Patient")
            ? "Edit My Profile"
            : "Edit Patient"}
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
                onClick={() => {
                  if (user?.roles?.includes("Patient")) {
                    navigate("/patient/profile");
                  } else {
                    navigate("/patients");
                  }
                }}
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
