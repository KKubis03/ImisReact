import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DoctorsService } from "../../api/services/doctors.service";
import { SpecializationsService } from "../../api/services/specializations.service";
import { DepartmentsService } from "../../api/services/departments.service";
import type { SelectListItem } from "../../api/types/pagination";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhoneNumber,
  validateLicenseNumber,
} from "../../utils/validators";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";
import { FormSelect } from "../../components/forms/FormSelect";
import LoadingCircle from "../../components/ui/LoadingCircle";
import { PATHS } from "../../routes/paths";

export default function DoctorFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

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
  const [specializations, setSpecializations] = useState<SelectListItem[]>([]);
  const [departments, setDepartments] = useState<SelectListItem[]>([]);
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
    if (isEditMode) {
      loadEditData();
    } else {
      loadAddData();
    }
  }, [id]);

  const loadAddData = async () => {
    try {
      setLoadingData(true);
      const [specializationsRes, departmentsRes] = await Promise.all([
        SpecializationsService.getSelectList(),
        DepartmentsService.getSelectList(),
      ]);
      setSpecializations(specializationsRes);
      setDepartments(departmentsRes);
    } catch (error: any) {
      setError(error.message || "Failed to load form options");
    } finally {
      setLoadingData(false);
    }
  };

  const loadEditData = async () => {
    if (!id) return;
    try {
      setError("");
      setLoadingData(true);
      const [doctorRes, specializationsRes, departmentsRes] = await Promise.all([
        DoctorsService.getById(Number(id)),
        SpecializationsService.getSelectList(),
        DepartmentsService.getSelectList(),
      ]);
      setFirstName(doctorRes.firstName);
      setLastName(doctorRes.lastName);
      setLicenseNumber(doctorRes.licenseNumber);
      setSpecializationId(String(doctorRes.specializationId));
      setDepartmentId(String(doctorRes.departmentId));
      setEmail(doctorRes.email);
      setPhoneNumber(doctorRes.phoneNumber);
      setSpecializations(specializationsRes);
      setDepartments(departmentsRes);
    } catch (error: any) {
      setError(error.message || "Failed to load doctor");
    } finally {
      setLoadingData(false);
    }
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
    if (Object.values(newErrors).some((e) => e !== "")) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      if (isEditMode) {
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
      } else {
        await DoctorsService.create({
          firstName,
          lastName,
          licenseNumber,
          specializationId: Number(specializationId),
          departmentId: Number(departmentId),
          email,
          phoneNumber,
        });
        setSuccess("Doctor created successfully!");
      }
      setTimeout(() => {
        isEditMode ? navigate(-1) : navigate(PATHS.DOCTORS);
      }, 500);
    } catch (error: any) {
      setError(error || "Failed to save doctor");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <LoadingCircle />;

  return (
    <FormWrapper
      title={isEditMode ? "Edit Doctor" : "Add Doctor"}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      isLoading={loading}
      error={error}
      success={success}
    >
      <FormInput
        label="First Name"
        value={firstName}
        onChange={(value) => {
          setFirstName(value);
          setErrors((prev) => ({ ...prev, firstName: validateFirstName(value) }));
        }}
        error={errors.firstName}
        required
      />
      <FormInput
        label="Last Name"
        value={lastName}
        onChange={(value) => {
          setLastName(value);
          setErrors((prev) => ({ ...prev, lastName: validateLastName(value) }));
        }}
        error={errors.lastName}
        required
      />
      <FormInput
        label="License Number"
        value={licenseNumber}
        onChange={(value) => {
          setLicenseNumber(value);
          setErrors((prev) => ({
            ...prev,
            licenseNumber: validateLicenseNumber(value),
          }));
        }}
        error={errors.licenseNumber}
        required
      />
      <FormSelect
        label="Specialization"
        value={specializationId}
        options={specializations}
        error={errors.specializationId}
        onChange={(value) => {
          setSpecializationId(value);
          setErrors((prev) => ({
            ...prev,
            specializationId: !value ? "Specialization is required" : "",
          }));
        }}
        required
      />
      <FormSelect
        label="Department"
        value={departmentId}
        options={departments}
        error={errors.departmentId}
        onChange={(value) => {
          setDepartmentId(value);
          setErrors((prev) => ({
            ...prev,
            departmentId: !value ? "Department is required" : "",
          }));
        }}
        required
      />
      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={(value) => {
          setEmail(value);
          setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        }}
        error={errors.email}
        required
      />
      <FormInput
        label="Phone Number"
        value={phoneNumber}
        onChange={(value) => {
          setPhoneNumber(value);
          setErrors((prev) => ({
            ...prev,
            phoneNumber: validatePhoneNumber(value),
          }));
        }}
        error={errors.phoneNumber}
        required
      />
    </FormWrapper>
  );
}
