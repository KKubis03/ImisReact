import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiscountsService } from "../../api/services/discounts.service";
import { validateName, validatePercentage } from "../../utils/validators";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";

export default function DiscountAddPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [percentage, setPercentage] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({
		name: "",
		percentage: "",
	});
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = {
			name: validateName(name),
			percentage: validatePercentage(percentage),
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
			await DiscountsService.create({
				name,
				percentage: Number(percentage),
			});
			setSuccess("Discount created successfully!");
			setTimeout(() => {
				navigate(-1);
			}, 500);
		} catch (err) {
			setError("Failed to create discount");
		} finally {
			setLoading(false);
		}
	};
	return (
		<FormWrapper
			title="Add New Discount"
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
					setErrors((prev) => ({
						...prev,
						name: validateName(val),
					}));
				}}
			/>
			<FormInput
				label="Percentage"
				type="number"
				value={percentage}
				error={errors.percentage}
				required
				onChange={(val) => {
					setPercentage(val);
					setErrors((prev) => ({
						...prev,
						percentage: validatePercentage(val),
					}));
				}}
			/>
		</FormWrapper>
	);
}
