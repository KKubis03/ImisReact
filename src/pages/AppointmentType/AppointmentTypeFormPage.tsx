import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppointmentTypesService } from "../../api/services/appointmentType.service";
import { validateName, validateDescription } from "../../utils/validators";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";
import LoadingCircle from "../../components/ui/LoadingCircle";

export default function AppointmentTypeFormPage() {
	const { id } = useParams<{ id: string }>();
	const isEditMode = !!id;
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(isEditMode);
	const [errors, setErrors] = useState({
		name: "",
		description: "",
	});

	useEffect(() => {
		if (isEditMode) loadType();
	}, [id]);

	const loadType = async () => {
		if (!id) return;
		try {
			setLoadingData(true);
			const response = await AppointmentTypesService.getById(Number(id));
			setName(response.name);
			setDescription(response.description);
		} catch {
			setError("Failed to load appointment type");
		} finally {
			setLoadingData(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = {
			name: validateName(name),
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
				await AppointmentTypesService.update(Number(id), {
					id: Number(id),
					name,
					description,
				});
				setSuccess("Appointment type updated successfully!");
			} else {
				await AppointmentTypesService.create({ name, description });
				setSuccess("Appointment type created successfully!");
			}
			setTimeout(() => navigate(-1), 500);
		} catch (error: any) {
			setError(
				isEditMode
					? error.message || "Failed to update appointment type"
					: error.message || "Failed to create appointment type",
			);
		} finally {
			setLoading(false);
		}
	};

	if (loadingData) return <LoadingCircle />;

	return (
		<FormWrapper
			title={isEditMode ? "Edit Appointment Type" : "Add New Appointment Type"}
			error={error}
			success={success}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isLoading={loading}
		>
			<FormInput
				label="Name"
				value={name}
				onChange={(val) => {
					setName(val);
					setErrors((prev) => ({ ...prev, name: validateName(val) }));
				}}
				error={errors.name}
				required
			/>
			<FormInput
				label="Description"
				value={description}
				onChange={(val) => {
					setDescription(val);
					setErrors((prev) => ({
						...prev,
						description: validateDescription(val),
					}));
				}}
				error={errors.description}
				required
			/>
		</FormWrapper>
	);
}
