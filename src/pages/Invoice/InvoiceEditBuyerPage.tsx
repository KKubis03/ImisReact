import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Alert,
	CircularProgress,
	Tooltip,
	Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { InvoiceService } from "../../api/services/invoice.service";
import type { Invoice } from "../../api/services/invoice.service";

export default function InvoiceEditBuyerPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [invoice, setInvoice] = useState<Invoice | null>(null);
	const [buyerName, setBuyerName] = useState("");
	const [buyerAddress, setBuyerAddress] = useState("");
	const [buyerTaxId, setBuyerTaxId] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);
	const [errors, setErrors] = useState({
		buyerName: "",
		buyerAddress: "",
		buyerTaxId: "",
	});
	useEffect(() => {
		loadInvoice();
	}, [id]);
	const loadInvoice = async () => {
		if (!id) return;
		try {
			setLoadingData(true);
			const response = await InvoiceService.getById(Number(id));
			const invoiceData = response;
			setInvoice(invoiceData);
			if (invoiceData.invoiceDetails) {
				setBuyerName(invoiceData.invoiceDetails.buyerName || "");
				setBuyerAddress(invoiceData.invoiceDetails.buyerAddress || "");
				setBuyerTaxId(invoiceData.invoiceDetails.buyerTaxId || "");
			}
		} catch (err) {
			setError("Failed to load invoice details");
		} finally {
			setLoadingData(false);
		}
	};
	const validateForm = () => {
		const newErrors = {
			buyerName: buyerName.trim() ? "" : "Buyer name is required",
			buyerAddress: buyerAddress.trim() ? "" : "Buyer address is required",
			buyerTaxId: "",
		};
		setErrors(newErrors);
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
			const payload = {
				name: buyerName.trim(),
				address: buyerAddress.trim(),
				taxId: buyerTaxId.trim() || undefined,
			};
			await InvoiceService.updateBuyerInfo(Number(id), payload);
			setSuccess("Buyer information updated successfully!");
			setTimeout(() => {
				navigate(-1);
			}, 500);
		} catch (err) {
			setError("Failed to update buyer information");
		} finally {
			setLoading(false);
		}
	};
	if (loadingData) {
		return (
			<Container
				maxWidth="lg"
				sx={{ mt: 10, mb: 6 }}
			>
				<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}
	if (error && !invoice) {
		return (
			<Container
				maxWidth="lg"
				sx={{ mt: 10, mb: 6 }}
			>
				<Alert
					severity="error"
					sx={{ mb: 2 }}
				>
					{error}
				</Alert>
				<Tooltip title="Go back">
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => navigate(-1)}
					>
						Back
					</Button>
				</Tooltip>
			</Container>
		);
	}
	if (!invoice) {
		return null;
	}
	return (
		<Container
			maxWidth="md"
			sx={{ mt: 10, mb: 6 }}
		>
			<Box sx={{ mb: 3 }}>
				<Tooltip title="Go back">
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => navigate(-1)}
						sx={{ mb: 2 }}
					>
						Back
					</Button>
				</Tooltip>
				<Typography
					variant="h3"
					color="primary"
					gutterBottom
				>
					Edit Buyer Information
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
				>
					{invoice.invoiceNumber}
				</Typography>
			</Box>
			<Paper sx={{ p: 4 }}>
				{error && (
					<Alert
						severity="error"
						sx={{ mb: 2 }}
					>
						{error}
					</Alert>
				)}
				{success && (
					<Alert
						severity="success"
						sx={{ mb: 2 }}
					>
						{success}
					</Alert>
				)}
				<Box
					component="form"
					onSubmit={handleSubmit}
				>
					<Typography
						variant="h6"
						color="primary"
						gutterBottom
					>
						Buyer Details
					</Typography>
					<Stack
						spacing={3}
						sx={{ mt: 3 }}
					>
						<TextField
							fullWidth
							label="Buyer Name"
							value={buyerName}
							onChange={(e) => {
								setBuyerName(e.target.value);
								setErrors((prev) => ({
									...prev,
									buyerName: e.target.value.trim()
										? ""
										: "Buyer name is required",
								}));
							}}
							required
							error={!!errors.buyerName}
							helperText={errors.buyerName}
						/>
						<TextField
							fullWidth
							label="Buyer Address"
							value={buyerAddress}
							onChange={(e) => {
								setBuyerAddress(e.target.value);
								setErrors((prev) => ({
									...prev,
									buyerAddress: e.target.value.trim()
										? ""
										: "Buyer address is required",
								}));
							}}
							required
							multiline
							rows={2}
							error={!!errors.buyerAddress}
							helperText={errors.buyerAddress}
						/>
						<TextField
							fullWidth
							label="Tax ID (Optional)"
							value={buyerTaxId}
							onChange={(e) => setBuyerTaxId(e.target.value)}
							helperText="Enter buyer's tax identification number if applicable"
						/>
					</Stack>
					<Box sx={{ mt: 4, display: "flex", gap: 2 }}>
						<Tooltip title="Save changes">
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={loading}
							>
								{loading ? <CircularProgress size={24} /> : "Save Changes"}
							</Button>
						</Tooltip>
						<Tooltip title="Cancel">
							<Button
								variant="outlined"
								onClick={() => navigate(-1)}
								disabled={loading}
							>
								Cancel
							</Button>
						</Tooltip>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}
