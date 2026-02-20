import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SpecializationsService } from "../../api/services/specializations.service";
import { validateName, validateDescription } from "../../utils/validators";
import LoadingCircle from "../../components/ui/LoadingCircle";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";

export default function SpecializationFormPage() {
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
		if (isEditMode) loadSpecialization();
	}, [id]);

	const loadSpecialization = async () => {
		if (!id) return;
		try {
			setLoadingData(true);
			const response = await SpecializationsService.getById(Number(id));
			setName(response.name);
			setDescription(response.description);
		} catch (error: any) {
			setError("Failed to load specialization");
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
				await SpecializationsService.update(Number(id), {
					id: Number(id),
					name,
					description,
				});
				setSuccess("Specialization updated successfully!");
			} else {
				await SpecializationsService.create({ name, description });
				setSuccess("Specialization created successfully!");
			}
			setTimeout(() => navigate(-1), 500);
		} catch (error: any) {
			setError(
				isEditMode
					? "Failed to update specialization"
					: "Failed to create specialization",
			);
		} finally {
			setLoading(false);
		}
	};

	if (loadingData) return <LoadingCircle />;

	return (
		<FormWrapper
			title={isEditMode ? "Edit Specialization" : "Add New Specialization"}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isLoading={loading}
			error={error}
			success={success}
		>
			<FormInput
				label="Name"
				value={name}
				error={errors.name}
				required
				onChange={(val) => {
					setName(val);
					setErrors((prev) => ({ ...prev, name: validateName(val) }));
				}}
			/>
			<FormInput
				label="Description"
				value={description}
				error={errors.description}
				required
				multiline
				rows={4}
				onChange={(val) => {
					setDescription(val);
					setErrors((prev) => ({
						...prev,
						description: validateDescription(val),
					}));
				}}
			/>
		</FormWrapper>
	);
}
