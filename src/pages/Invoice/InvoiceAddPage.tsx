import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	IconButton,
	Divider,
	Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	InvoiceService,
	type CreateInvoiceWithItemsDto,
} from "../../api/services/invoice.service";
import { PaymentMethodsService } from "../../api/services/paymentMethod.service";
import { AppointmentTypesService } from "../../api/services/appointmentType.service";
import {
	PriceListService,
	type PriceListItem,
} from "../../api/services/priceList.service";
import { AppointmentsService } from "../../api/services/appointments.service";
import { DiscountsService } from "../../api/services/discounts.service";
import type { SelectListItem } from "../../api/types/pagination";
import LoadingCircle from "../../components/ui/LoadingCircle";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";
import { FormSelect } from "../../components/forms/FormSelect";

interface InvoiceItem {
	name: string;
	quantity: number;
	unitPrice: number;
	vatRate: number;
	unit: string;
	isCustom: boolean;
	appointmentTypeId?: number;
}

export default function InvoiceAddPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const appointmentId = location.state?.appointmentId;
	const today = new Date();
	const twoWeeksLater = new Date(today);
	twoWeeksLater.setDate(today.getDate() + 14);
	const [issueDate, setIssueDate] = useState(today.toISOString().split("T")[0]);
	const [dueDate, setDueDate] = useState(
		twoWeeksLater.toISOString().split("T")[0],
	);

	const [paymentMethodId, setPaymentMethodId] = useState("");
	const [discountId, setDiscountId] = useState("");
	const [buyerName, setBuyerName] = useState("");
	const [buyerAddress, setBuyerAddress] = useState("");
	const [buyerTaxId, setBuyerTaxId] = useState("");
	const [items, setItems] = useState<InvoiceItem[]>([
		{
			name: "",
			quantity: 1,
			unitPrice: 0,
			vatRate: 23,
			unit: "usł",
			isCustom: true,
		},
	]);

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);
	const [errors, setErrors] = useState({
		issueDate: "",
		dueDate: "",
		paymentMethodId: "",
		buyerName: "",
		buyerAddress: "",
		buyerTaxId: "",
	});

	const [paymentMethods, setPaymentMethods] = useState<SelectListItem[]>([]);
	const [appointmentTypes, setAppointmentTypes] = useState<SelectListItem[]>([]);

	const [priceList, setPriceList] = useState<PriceListItem[]>([]);
	const [discounts, setDiscounts] = useState<SelectListItem[]>([]);

	useEffect(() => {
		loadOptions();
	}, []);
	useEffect(() => {
		if (appointmentId && priceList.length > 0) {
			loadAppointmentData();
		}
	}, [appointmentId, priceList]);

	const loadOptions = async () => {
		try {
			setLoadingData(true);
			const [
				paymentMethodsRes,
				appointmentTypesRes,
				priceListRes,
				discountsRes,
			] = await Promise.all([
				PaymentMethodsService.getLookup(),
				AppointmentTypesService.getSelectList(),
				PriceListService.getAll(),
				DiscountsService.getAll(),
			]);
			setPaymentMethods(paymentMethodsRes);
			setAppointmentTypes(appointmentTypesRes);
			setPriceList(priceListRes.items);
			setDiscounts(
				discountsRes.items.map((d) => ({
					id: d.id,
					displayName: `${d.name} (${d.percentage}%)`,
				})),
			);
		} catch (err) {
			setError("Failed to load form options");
		} finally {
			setLoadingData(false);
		}
	};
	const loadAppointmentData = async () => {
		try {
			setLoadingData(true);
			const appointmentRes =
				await AppointmentsService.getWithDetails(appointmentId);
			const appointment = appointmentRes;
			setBuyerName(
				`${appointment.patient.firstName} ${appointment.patient.lastName}`,
			);
			setItems([
				{
					name: appointment.appointmentTypeName,
					quantity: 1,
					unitPrice: appointment.unitPrice || 0,
					vatRate: 23,
					unit: "usł",
					isCustom: false,
				},
			]);
		} catch (err) {
			setError("Failed to load appointment data");
		} finally {
			setLoadingData(false);
		}
	};
	const validateForm = () => {
		const newErrors = {
			issueDate: issueDate ? "" : "Issue date is required",
			dueDate: dueDate ? "" : "Due date is required",
			paymentMethodId: paymentMethodId ? "" : "Payment method is required",
			buyerName: buyerName ? "" : "Buyer name is required",
			buyerAddress: buyerAddress ? "" : "Buyer address is required",
			buyerTaxId: buyerTaxId ? "" : "Buyer tax ID is required",
		};
		setErrors(newErrors);
		const hasInvalidItems = items.some(
			(item) =>
				!item.name || item.quantity <= 0 || item.unitPrice < 0 || !item.unit,
		);
		if (hasInvalidItems) {
			setError("All items must have a name, valid quantity, price, and unit");
			return false;
		}
		if (items.length === 0) {
			setError("At least one item is required");
			return false;
		}
		return !Object.values(newErrors).some((error) => error !== "");
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
		try {
			setLoading(true);
			setError("");
			const payload: CreateInvoiceWithItemsDto = {
				...(appointmentId && { appointmentId }),
				issueDate,
				dueDate,
				paymentMethodId: Number(paymentMethodId),
				...(discountId && { discountId: Number(discountId) }),
				buyerName,
				buyerAddress,
				buyerTaxId,
				items: items.map((item) => ({
					name: item.name,
					quantity: item.quantity,
					unitPrice: item.unitPrice,
					vatRate: item.vatRate,
					unit: item.unit,
				})),
			};
			await InvoiceService.create(payload);
			setSuccess("Invoice created successfully!");
			setTimeout(() => {
				navigate(-1);
			}, 500);
		} catch (err) {
			setError("Failed to create invoice");
		} finally {
			setLoading(false);
		}
	};
	const handleAddItem = () => {
		setItems([
			...items,
			{
				name: "",
				quantity: 1,
				unitPrice: 0,
				vatRate: 23,
				unit: "usł",
				isCustom: true,
			},
		]);
	};
	const handleRemoveItem = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};
	const handleItemChange = (
		index: number,
		field: keyof InvoiceItem,
		value: any,
	) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value };
		setItems(newItems);
	};
	const handleAppointmentTypeSelect = (index: number, typeId: string) => {
		if (typeId === "custom") {
			const newItems = [...items];
			newItems[index] = {
				...newItems[index],
				isCustom: true,
				appointmentTypeId: undefined,
				name: "",
				unitPrice: 0,
				vatRate: 23,
				unit: "usł",
			};
			setItems(newItems);
		} else {
			const selectedType = appointmentTypes.find(
				(t) => t.id === Number(typeId),
			);
			const priceItem = priceList.find(
				(p) => p.appointmentTypeId === Number(typeId),
			);
			if (selectedType) {
				const newItems = [...items];
				newItems[index] = {
					...newItems[index],
					isCustom: false,
					appointmentTypeId: Number(selectedType.id),
					name: selectedType.displayName,
					unitPrice: priceItem?.price || 0,
					vatRate: 23,
					unit: "usł",
				};
				setItems(newItems);
			}
		}
	};
	if (loadingData) {
		return <LoadingCircle />;
	}
	const appointmentTypeOptions = appointmentTypes.map((type) => ({
		id: type.id,
		displayName: type.displayName,
	}));
	return (
		<FormWrapper
			title={appointmentId ? "Add Invoice from Appointment" : "Add New Invoice"}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isLoading={loading}
			error={error}
			success={success}
			submitLabel="Save Invoice"
		>
			<Typography
				variant="h6"
				color="primary"
				gutterBottom
			>
				Invoice Details
			</Typography>
			<Box
				sx={{
					display: "grid",
					gap: 2,
					gridTemplateColumns: {
						xs: "1fr",
						md: "repeat(2, 1fr)",
						lg: "repeat(3, 1fr)",
					},
				}}
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
			</Box>
			<Divider sx={{ my: 4 }} />
			<Typography
				variant="h6"
				color="primary"
				gutterBottom
			>
				Buyer Information
			</Typography>
			<Stack spacing={2}>
				<FormInput
					label="Buyer Name"
					value={buyerName}
					error={errors.buyerName}
					required
					onChange={(val) => {
						setBuyerName(val);
						setErrors((prev) => ({
							...prev,
							buyerName: val ? "" : "Buyer name is required",
						}));
					}}
				/>
				<FormInput
					label="Buyer Address"
					value={buyerAddress}
					error={errors.buyerAddress}
					required
					onChange={(val) => {
						setBuyerAddress(val);
						setErrors((prev) => ({
							...prev,
							buyerAddress: val ? "" : "Buyer address is required",
						}));
					}}
				/>
				<FormInput
					label="Buyer Tax ID"
					value={buyerTaxId}
					error={errors.buyerTaxId}
					required
					onChange={(val) => {
						setBuyerTaxId(val);
						setErrors((prev) => ({
							...prev,
							buyerTaxId: val ? "" : "Buyer tax ID is required",
						}));
					}}
				/>
			</Stack>
			<Divider sx={{ my: 4 }} />
			{!appointmentId && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}
				>
					<Typography
						variant="h6"
						color="primary"
					>
						Invoice Items
					</Typography>
					<Button
						variant="outlined"
						color="primary"
						startIcon={<AddIcon />}
						onClick={handleAddItem}
					>
						Add Item
					</Button>
				</Box>
			)}
			{appointmentId && (
				<Typography
					variant="h6"
					color="primary"
					sx={{ mb: 2 }}
				>
					Invoice Items
				</Typography>
			)}
			{items.map((item, index) => (
				<Paper
					key={index}
					variant="outlined"
					sx={{ p: 2, mb: 2, position: "relative" }}
				>
					{!appointmentId && (
						<Box
							sx={{
								position: "absolute",
								top: 8,
								right: 8,
							}}
						>
							<IconButton
								color="error"
								size="small"
								onClick={() => handleRemoveItem(index)}
								disabled={items.length === 1}
							>
								<DeleteIcon />
							</IconButton>
						</Box>
					)}
					<Typography
						variant="subtitle1"
						gutterBottom
					>
						Item {index + 1}
					</Typography>
					<Stack spacing={2}>
						{!appointmentId && (
							<FormSelect
								label="Service Type"
								value={
									item.isCustom
										? "custom"
										: item.appointmentTypeId?.toString() || "custom"
								}
								options={[
									{ id: "custom", displayName: "Custom Service" },
									...appointmentTypeOptions,
								]}
								onChange={(val) => handleAppointmentTypeSelect(index, val)}
							/>
						)}
						{(!item.isCustom || appointmentId) && (
							<Box sx={{ p: 2, borderRadius: 1 }}>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									<strong>Service:</strong> {item.name}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									<strong>Unit Price:</strong> {item.unitPrice.toFixed(2)} PLN
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									<strong>VAT Rate:</strong> {item.vatRate}%
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									<strong>Unit:</strong> {item.unit}
								</Typography>
							</Box>
						)}
						{item.isCustom && !appointmentId && (
							<Stack spacing={2}>
								<TextField
									size="small"
									fullWidth
									label="Service Name"
									value={item.name}
									onChange={(e) =>
										handleItemChange(index, "name", e.target.value)
									}
									margin="normal"
									required
								/>
								<Stack
									spacing={2}
									direction={{ xs: "column", md: "row" }}
								>
									<TextField
										size="small"
										fullWidth
										label="Unit Price"
										type="number"
										value={item.unitPrice}
										onChange={(e) =>
											handleItemChange(
												index,
												"unitPrice",
												Number(e.target.value),
											)
										}
										margin="normal"
										required
										inputProps={{ min: 0, step: 0.01 }}
									/>
									<TextField
										size="small"
										fullWidth
										label="VAT Rate (%)"
										type="number"
										value={item.vatRate}
										onChange={(e) =>
											handleItemChange(index, "vatRate", Number(e.target.value))
										}
										margin="normal"
										required
										inputProps={{ min: 0, max: 100, step: 1 }}
									/>
									<TextField
										size="small"
										fullWidth
										label="Unit"
										value={item.unit}
										onChange={(e) =>
											handleItemChange(index, "unit", e.target.value)
										}
										margin="normal"
										required
										placeholder="e.g., usł, szt, kg"
									/>
								</Stack>
							</Stack>
						)}
						{!appointmentId && (
							<TextField
								size="small"
								fullWidth
								label="Quantity"
								type="number"
								value={item.quantity}
								onChange={(e) =>
									handleItemChange(index, "quantity", Number(e.target.value))
								}
								margin="normal"
								required
								inputProps={{ min: 1, step: 1 }}
							/>
						)}
					</Stack>
					<Box sx={{ mt: 2, textAlign: "right" }}>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							Total: {(item.quantity * item.unitPrice).toFixed(2)} PLN
						</Typography>
					</Box>
				</Paper>
			))}
			<Box sx={{ mt: 3, p: 2, borderRadius: 1 }}>
				<Typography
					variant="h6"
					gutterBottom
				>
					Summary
				</Typography>
				<Stack spacing={1}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography variant="body1">Net Total:</Typography>
						<Typography variant="body1">
							{items
								.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
								.toFixed(2)}{" "}
							PLN
						</Typography>
					</Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography variant="body1">VAT:</Typography>
						<Typography variant="body1">
							{items
								.reduce(
									(sum, item) =>
										sum + item.quantity * item.unitPrice * (item.vatRate / 100),
									0,
								)
								.toFixed(2)}{" "}
							PLN
						</Typography>
					</Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography
							variant="h6"
							color="primary"
						>
							Gross Total:
						</Typography>
						<Typography
							variant="h6"
							color="primary"
						>
							{items
								.reduce(
									(sum, item) =>
										sum +
										item.quantity * item.unitPrice * (1 + item.vatRate / 100),
									0,
								)
								.toFixed(2)}{" "}
							PLN
						</Typography>
					</Box>
				</Stack>
			</Box>
		</FormWrapper>
	);
}
