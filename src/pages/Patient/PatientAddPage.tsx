import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
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
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";

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
				navigate(-1);
			}, 500);
		} catch (err: any) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};
	return (
		<FormWrapper
			title="Add New Patient"
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
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
