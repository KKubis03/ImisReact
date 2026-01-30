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
import { DoctorsService } from "../../api/services/doctors.service";
import { SpecializationsService } from "../../api/services/specializations.service";
import { DepartmentsService } from "../../api/services/departments.service";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhoneNumber,
} from "../../utils/validators";

export default function DoctorEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [specializationId, setSpecializationId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [specializations, setSpecializations] = useState<
    { id: number; name: string }[]
  >([]);
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    licenseNumber: "",
    specializationId: "",
    departmentId: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const [doctorRes, specializationsRes, departmentsRes] = await Promise.all(
        [
          DoctorsService.getById(Number(id)),
          SpecializationsService.getSelectList(),
          DepartmentsService.getSelectList(),
        ]
      );

      const doctor = doctorRes.data;
      setFirstName(doctor.firstName);
      setLastName(doctor.lastName);
      setLicenseNumber(doctor.licenseNumber);
      setSpecializationId(String(doctor.specializationId));
      setDepartmentId(String(doctor.departmentId));
      setEmail(doctor.email);
      setPhoneNumber(doctor.phoneNumber);

      setSpecializations(specializationsRes.data);
      setDepartments(departmentsRes.data);
    } catch (err) {
      setError("Failed to load doctor");
    } finally {
      setLoadingData(false);
    }
  };

  const validateLicenseNumber = (value: string): string => {
    if (!value.trim()) return "License number is required";
    if (value.length < 3) return "License number must be at least 3 characters";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      licenseNumber: validateLicenseNumber(licenseNumber),
      specializationId: !specializationId ? "Specialization is required" : "",
      departmentId: !departmentId ? "Department is required" : "",
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
      await DoctorsService.update(Number(id), {
        id: Number(id),
        firstName,
        lastName,
        licenseNumber,
        specializationId: Number(specializationId),
        departmentId: Number(departmentId),
        email,
        phoneNumber,
      });
      setSuccess("Doctor updated successfully!");
      setTimeout(() => {
        navigate("/doctors");
      }, 2000);
    } catch (err) {
      setError("Failed to update doctor");
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
          Edit Doctor
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
            label="License Number"
            value={licenseNumber}
            onChange={(e) => {
              setLicenseNumber(e.target.value);
              setErrors((prev) => ({
                ...prev,
                licenseNumber: validateLicenseNumber(e.target.value),
              }));
            }}
            margin="normal"
            required
            error={!!errors.licenseNumber}
            helperText={errors.licenseNumber}
          />

          <TextField
            fullWidth
            select
            label="Specialization"
            value={specializationId}
            onChange={(e) => {
              setSpecializationId(e.target.value);
              setErrors((prev) => ({
                ...prev,
                specializationId: !e.target.value
                  ? "Specialization is required"
                  : "",
              }));
            }}
            margin="normal"
            required
            error={!!errors.specializationId}
            helperText={errors.specializationId}
          >
            {specializations.map((spec) => (
              <MenuItem key={spec.id} value={spec.id}>
                {spec.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Department"
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setErrors((prev) => ({
                ...prev,
                departmentId: !e.target.value ? "Department is required" : "",
              }));
            }}
            margin="normal"
            required
            error={!!errors.departmentId}
            helperText={errors.departmentId}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
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
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Tooltip>
            <Tooltip title="Cancel">
              <Button
                variant="outlined"
                onClick={() => navigate("/doctors")}
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
