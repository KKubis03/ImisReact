import { useEffect, useState } from "react";
import {
	Alert,
	Box,
	Card,
	CardContent,
	CircularProgress,
	Tooltip,
	Typography,
} from "@mui/material";
import {
	PriceListService,
	type PriceListItemDto,
} from "../../api/services/priceList.service";

export default function PriceList() {
	const [prices, setPrices] = useState<PriceListItemDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadPrices = async () => {
			try {
				setLoading(true);
				const response = await PriceListService.getPrices();
				setPrices(response || []);
				setError("");
			} catch {
				setError("Failed to load price list");
				setPrices([]);
			} finally {
				setLoading(false);
			}
		};
		loadPrices();
	}, []);
	return (
		<Box>
			{loading && (
				<Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
					<CircularProgress size={28} />
				</Box>
			)}
			{!loading && error && <Alert severity="error">{error}</Alert>}
			{!loading && !error && (
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
					{prices.map((item, index) => (
						<Box key={`${item.appointmentTypeName}-${index}`}>
							<Tooltip
								title={item.appointmentTypeDescription}
								placement="top"
							>
								<Card
									sx={{
										width: 200,
										height: 150,
										display: "flex",
										flexDirection: "column",
									}}
								>
									<CardContent
										sx={{
											height: "100%",
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											alignItems: "center",
											textAlign: "center",
											p: 2,
										}}
									>
										<Typography
											variant="h6"
											sx={{ fontWeight: "bold", lineHeight: 1.2 }}
										>
											{item.appointmentTypeName}
										</Typography>
										<Typography
											variant="h6"
											color="primary"
											sx={{ fontWeight: "bold" }}
										>
											{item.price.toFixed(2)} PLN
										</Typography>
									</CardContent>
								</Card>
							</Tooltip>
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
}
