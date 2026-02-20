import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import { AppointmentStatusesService } from "../../api/services/appointmentStatuses.service";
import {
  validateStatusName,
  validateDescription,
} from "../../utils/validators";
import LoadingCircle from "../../components/ui/LoadingCircle";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";

export default function AppointmentStatusFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [statusName, setStatusName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [errors, setErrors] = useState({
    statusName: "",
    description: "",
  });

  useEffect(() => {
    if (isEditMode) loadStatus();
  }, [id]);

  const loadStatus = async () => {
    if (!id) return;
    try {
      setError("");
      setLoadingData(true);
      const response = await AppointmentStatusesService.getById(Number(id));
      setStatusName(response.statusName);
      setDescription(response.description);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      statusName: validateStatusName(statusName),
      description: validateDescription(description),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e !== "")) {
      setError("Please fix all validation errors");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (isEditMode) {
        await AppointmentStatusesService.update(Number(id), {
          id: Number(id),
          statusName,
          description,
        });
        setSuccess("Appointment status updated successfully!");
      } else {
        await AppointmentStatusesService.create({ statusName, description });
        setSuccess("Appointment status created successfully!");
      }
      setTimeout(() => navigate(-1), 500);
    } catch (error: any) {
      setError(
        isEditMode
          ? error.message || "Failed to update status"
          : error.message || "Failed to create status",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <LoadingCircle />;

  return (
    <FormWrapper
      title={
        isEditMode ? "Edit Appointment Status" : "Add New Appointment Status"
      }
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      isLoading={loading}
      error={error}
      success={success}
    >
      <FormInput
        label="Status Name"
        value={statusName}
        error={errors.statusName}
        required
        onChange={(val) => {
          setStatusName(val);
          setErrors((prev) => ({
            ...prev,
            statusName: validateStatusName(val),
          }));
        }}
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
    </FormWrapper>
  );
}
