import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PaymentMethodsService } from "../../api/services/paymentMethod.service";
import { validateName, validateDescription } from "../../utils/validators";
import LoadingCircle from "../../components/ui/LoadingCircle";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";

export default function PaymentMethodFormPage() {
	const { id } = useParams<{ id: string }>();
	const isEditMode = !!id;
	const navigate = useNavigate();

	const [methodName, setMethodName] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(isEditMode);
	const [errors, setErrors] = useState({
		methodName: "",
		description: "",
	});

	useEffect(() => {
		if (isEditMode) loadMethod();
	}, [id]);

	const loadMethod = async () => {
		if (!id) return;
		try {
			setLoadingData(true);
			const response = await PaymentMethodsService.getById(Number(id));
			setMethodName(response.methodName);
			setDescription(response.description);
		} catch (error: any) {
			setError("Failed to load payment method");
		} finally {
			setLoadingData(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = {
			methodName: validateName(methodName),
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
				await PaymentMethodsService.update(Number(id), {
					id: Number(id),
					methodName,
					description,
				});
				setSuccess("Payment method updated successfully!");
			} else {
				await PaymentMethodsService.create({ methodName, description });
				setSuccess("Payment method created successfully!");
			}
			setTimeout(() => navigate(-1), 500);
		} catch (error: any) {
			setError(
				isEditMode
					? "Failed to update payment method"
					: "Failed to create payment method",
			);
		} finally {
			setLoading(false);
		}
	};

	if (loadingData) return <LoadingCircle />;

	return (
		<FormWrapper
			title={isEditMode ? "Edit Payment Method" : "Add New Payment Method"}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isLoading={loading}
			error={error}
			success={success}
		>
			<FormInput
				label="Method Name"
				value={methodName}
				error={errors.methodName}
				required
				onChange={(val) => {
					setMethodName(val);
					setErrors((prev) => ({ ...prev, methodName: validateName(val) }));
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
