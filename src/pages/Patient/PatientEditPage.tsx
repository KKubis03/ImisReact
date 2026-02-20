import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
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
import LoadingCircle from "../../components/ui/LoadingCircle";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";

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
		const patientId = id || (user?.patientId ? String(user.patientId) : null);
		if (!patientId) {
			setError("Invalid patient ID");
			setLoadingData(false);
			return;
		}
		if (
			!id &&
			user?.roles?.includes("Patient") &&
			user.patientId !== Number(patientId)
		) {
			setError("You can only edit your own profile");
			setLoadingData(false);
			return;
		}
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
			const patient = response;
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
				navigate(-1);
			}, 500);
		} catch (err) {
			setError("Failed to update patient");
		} finally {
			setLoading(false);
		}
	};
	const handleCancel = () => {
		navigate(-1);
	};
	if (loadingData) {
		return <LoadingCircle />;
	}
	return (
		<FormWrapper
			title={
				user?.roles?.includes("Patient") ? "Edit My Profile" : "Edit Patient"
			}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
			isLoading={loading}
			error={error}
			success={success}
		>
			<FormInput
				label="First Name"
				value={firstName}
				error={errors.firstName}
				required
				onChange={(val) => {
					setFirstName(val);
					setErrors((prev) => ({
						...prev,
						firstName: validateFirstName(val),
					}));
				}}
			/>
			<FormInput
				label="Last Name"
				value={lastName}
				error={errors.lastName}
				required
				onChange={(val) => {
					setLastName(val);
					setErrors((prev) => ({
						...prev,
						lastName: validateLastName(val),
					}));
				}}
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
			<FormInput
				label="Date of Birth"
				type="date"
				value={dateOfBirth}
				shrink
				error={errors.dateOfBirth}
				required
				onChange={(val) => {
					setDateOfBirth(val);
					setErrors((prev) => ({
						...prev,
						dateOfBirth: validateDateOfBirth(val),
					}));
				}}
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
			<FormInput
				label="Email"
				type="email"
				value={email}
				error={errors.email}
				required
				onChange={(val) => {
					setEmail(val);
					setErrors((prev) => ({
						...prev,
						email: validateEmail(val),
					}));
				}}
			/>
			<FormInput
				label="Phone Number"
				value={phoneNumber}
				error={errors.phoneNumber}
				required
				onChange={(val) => {
					setPhoneNumber(val);
					setErrors((prev) => ({
						...prev,
						phoneNumber: validatePhoneNumber(val),
					}));
				}}
			/>
		</FormWrapper>
	);
}
