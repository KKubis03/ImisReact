import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import FormWrapper from "../../components/forms/FormWrapper";
import { PriceListService } from "../../api/services/priceList.service";
import {
	validatePrice,
	validatePriceListAppointmentType,
} from "../../utils/validators";
import {
	AppointmentTypesService,
	type AppointmentType,
} from "../../api/services/appointmentType.service";
import LoadingCircle from "../../components/ui/LoadingCircle";

export default function PriceListFormPage() {
	const { id } = useParams<{ id: string }>();
	const isEditMode = !!id;
	const navigate = useNavigate();

	const [appointmentTypeId, setAppointmentTypeId] = useState<number>(0);
	const [price, setPrice] = useState("");
	const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(
		[],
	);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);
	const [errors, setErrors] = useState({
		appointmentTypeId: "",
		price: "",
	});

	useEffect(() => {
		if (isEditMode) {
			loadData();
		} else {
			loadAppointmentTypes();
		}
	}, [id]);

	const loadAppointmentTypes = async () => {
		try {
			setLoadingData(true);
			const response = await AppointmentTypesService.getAll();
			setAppointmentTypes(response.items);
		} catch (error: any) {
			setError("Failed to load appointment types");
		} finally {
			setLoadingData(false);
		}
	};

	const loadData = async () => {
		if (!id) return;
		try {
			setLoadingData(true);
			const [priceListResponse, appointmentTypesResponse] = await Promise.all([
				PriceListService.getById(Number(id)),
				AppointmentTypesService.getAll(),
			]);
			setAppointmentTypeId(priceListResponse.appointmentTypeId);
			setPrice(priceListResponse.price.toString());
			setAppointmentTypes(appointmentTypesResponse.items);
		} catch (error: any) {
			setError("Failed to load price list item");
		} finally {
			setLoadingData(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = {
			appointmentTypeId: validatePriceListAppointmentType(appointmentTypeId),
			price: validatePrice(price),
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
				await PriceListService.update(Number(id), {
					id: Number(id),
					appointmentTypeId,
					price: parseFloat(price),
				});
				setSuccess("Price list item updated successfully!");
			} else {
				await PriceListService.create({
					appointmentTypeId,
					price: parseFloat(price),
				});
				setSuccess("Price list item created successfully!");
			}
			setTimeout(() => navigate(-1), 500);
		} catch (error: any) {
			if (error.response?.data?.message) {
				setError(error.response.data.message);
			} else {
				setError(
					isEditMode
						? "Failed to update price list item"
						: "Failed to create price list item",
				);
			}
		} finally {
			setLoading(false);
		}
	};

	if (loadingData) return <LoadingCircle />;

	return (
		<FormWrapper
			title={isEditMode ? "Edit Price" : "Add New Price"}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isLoading={loading}
			error={error}
			success={success}
		>
			<TextField
				fullWidth
				select
				label="Appointment Type"
				value={appointmentTypeId}
				onChange={(e) => {
					const value = Number(e.target.value);
					setAppointmentTypeId(value);
					setErrors((prev) => ({
						...prev,
						appointmentTypeId: validatePriceListAppointmentType(value),
					}));
				}}
				margin="normal"
				required
				error={!!errors.appointmentTypeId}
				helperText={errors.appointmentTypeId}
			>
				<MenuItem
					value={0}
					disabled
				>
					Select appointment type
				</MenuItem>
				{appointmentTypes.map((type) => (
					<MenuItem
						key={type.id}
						value={type.id}
					>
						{type.name}
					</MenuItem>
				))}
			</TextField>
			<TextField
				fullWidth
				label="Price"
				value={price}
				onChange={(e) => {
					setPrice(e.target.value);
					setErrors((prev) => ({
						...prev,
						price: validatePrice(e.target.value),
					}));
				}}
				margin="normal"
				required
				type="number"
				inputProps={{ step: "0.01", min: "0" }}
				error={!!errors.price}
				helperText={errors.price}
			/>
		</FormWrapper>
	);
}
