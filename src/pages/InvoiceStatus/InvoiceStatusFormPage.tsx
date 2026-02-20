import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InvoiceStatusesService } from "../../api/services/invoiceStatus.service";
import { validateName, validateDescription } from "../../utils/validators";
import LoadingCircle from "../../components/ui/LoadingCircle";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";

export default function InvoiceStatusFormPage() {
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
			setLoadingData(true);
			const response = await InvoiceStatusesService.getById(Number(id));
			setStatusName(response.statusName);
			setDescription(response.description);
		} catch (error: any) {
			setError("Failed to load invoice status");
		} finally {
			setLoadingData(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = {
			statusName: validateName(statusName),
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
				await InvoiceStatusesService.update(Number(id), {
					id: Number(id),
					statusName,
					description,
				});
				setSuccess("Invoice status updated successfully!");
			} else {
				await InvoiceStatusesService.create({ statusName, description });
				setSuccess("Invoice status created successfully!");
			}
			setTimeout(() => navigate(-1), 500);
		} catch (error: any) {
			setError(
				isEditMode
					? "Failed to update invoice status"
					: "Failed to create invoice status",
			);
		} finally {
			setLoading(false);
		}
	};

	if (loadingData) return <LoadingCircle />;

	return (
		<FormWrapper
			title={isEditMode ? "Edit Invoice Status" : "Add New Invoice Status"}
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
					setErrors((prev) => ({ ...prev, statusName: validateName(val) }));
				}}
			/>
			<FormInput
				label="Description"
				value={description}
				error={errors.description}
				multiline
				rows={3}
				required
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
