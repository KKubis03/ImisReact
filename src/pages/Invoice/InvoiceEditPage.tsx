import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { InvoiceService } from "../../api/services/invoice.service";
import { PaymentMethodsService } from "../../api/services/paymentMethod.service";
import { DiscountsService } from "../../api/services/discounts.service";
import type { SelectListItem } from "../../api/types/pagination";
import LoadingCircle from "../../components/ui/LoadingCircle";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";
import { FormSelect } from "../../components/forms/FormSelect";

export default function InvoiceEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [issueDate, setIssueDate] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [paymentMethodId, setPaymentMethodId] = useState("");
	const [discountId, setDiscountId] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);
	const [errors, setErrors] = useState({
		issueDate: "",
		dueDate: "",
		paymentMethodId: "",
	});
	const [paymentMethods, setPaymentMethods] = useState<SelectListItem[]>([]);
	const [discounts, setDiscounts] = useState<SelectListItem[]>([]);
	useEffect(() => {
		loadData();
	}, [id]);
	const loadData = async () => {
		try {
			setLoadingData(true);
			const [invoiceRes, paymentMethodsRes, discountsRes] = await Promise.all([
				InvoiceService.getById(Number(id)),
				PaymentMethodsService.getLookup(),
				DiscountsService.getAll(),
			]);
			const invoice = invoiceRes;
			setIssueDate(invoice.issueDate.split("T")[0]);
			setDueDate(invoice.dueDate.split("T")[0]);
			const paymentMethod = paymentMethodsRes.find(
				(pm) => pm.displayName === invoice.paymentMethodName,
			);
			setPaymentMethodId(paymentMethod ? String(paymentMethod.id) : "");
			const discount = discountsRes.items.find(
				(d) => d.name === invoice.discountName,
			);
			setDiscountId(discount ? String(discount.id) : "");
			setPaymentMethods(paymentMethodsRes);
			setDiscounts(
				discountsRes.items.map((d) => ({
					id: d.id,
					displayName: `${d.name} (${d.percentage}%)`,
				})),
			);
		} catch (err) {
			setError("Failed to load invoice data");
		} finally {
			setLoadingData(false);
		}
	};
	const validateForm = () => {
		const newErrors = {
			issueDate: issueDate ? "" : "Issue date is required",
			dueDate: dueDate ? "" : "Due date is required",
			paymentMethodId: paymentMethodId ? "" : "Payment method is required",
		};
		setErrors(newErrors);
		return !Object.values(newErrors).some((error) => error !== "");
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) {
			setError("Please fill in all required fields");
			return;
		}
		try {
			setLoading(true);
			setError("");
			await InvoiceService.update({
				id: Number(id),
				issueDate,
				dueDate,
				paymentMethodId: Number(paymentMethodId),
				...(discountId && { discountId: Number(discountId) }),
			});
			setSuccess("Invoice updated successfully!");
			setTimeout(() => {
				navigate(-1);
			}, 500);
		} catch (err) {
			setError(
				err instanceof AxiosError
					? err.response?.data
					: "Failed to update invoice",
			);
		} finally {
			setLoading(false);
		}
	};
	if (loadingData) {
		return <LoadingCircle />;
	}
	return (
		<FormWrapper
			title="Edit Invoice"
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isLoading={loading}
			error={error}
			success={success}
		>
			<FormInput
				label="Issue Date"
				type="date"
				value={issueDate}
				error={errors.issueDate}
				required
				shrink
				onChange={(val) => {
					setIssueDate(val);
					setErrors((prev) => ({
						...prev,
						issueDate: val ? "" : "Issue date is required",
					}));
				}}
			/>
			<FormInput
				label="Due Date"
				type="date"
				value={dueDate}
				error={errors.dueDate}
				required
				shrink
				onChange={(val) => {
					setDueDate(val);
					setErrors((prev) => ({
						...prev,
						dueDate: val ? "" : "Due date is required",
					}));
				}}
			/>
			<FormSelect
				label="Payment Method"
				value={paymentMethodId}
				options={paymentMethods}
				error={errors.paymentMethodId}
				required
				onChange={(val) => {
					setPaymentMethodId(val);
					setErrors((prev) => ({
						...prev,
						paymentMethodId: val ? "" : "Payment method is required",
					}));
				}}
			/>
			<FormSelect
				label="Discount"
				value={discountId}
				options={[{ id: "", displayName: "None" }, ...discounts]}
				onChange={(val) => setDiscountId(val)}
			/>
		</FormWrapper>
	);
}
