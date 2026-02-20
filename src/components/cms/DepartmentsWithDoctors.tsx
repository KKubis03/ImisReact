import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Box,
	CircularProgress,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";
import {
	DepartmentsService,
	type DepartmentWithDoctorsDto,
} from "../../api/services/departments.service";

export default function DepartmentsWithDoctors() {
	const [departments, setDepartments] = useState<DepartmentWithDoctorsDto[]>(
		[],
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadDepartmentsWithDoctors = async () => {
			try {
				setLoading(true);
				const response = await DepartmentsService.getAllWithDoctors();
				setDepartments(response || []);
				setError("");
			} catch {
				setError("Failed to load departments with doctors");
				setDepartments([]);
			} finally {
				setLoading(false);
			}
		};
		loadDepartmentsWithDoctors();
	}, []);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
				<CircularProgress size={28} />
			</Box>
		);
	}
	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}

	return (
		<Box>
			{departments.map((department) => (
				<Accordion
					key={department.departmentName}
					disableGutters
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography fontWeight={600}>
							{department.departmentName}
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{department.doctors.length === 0 ? (
							<Typography
								variant="body2"
								color="text.secondary"
							>
								No doctors available.
							</Typography>
						) : (
							<List
								dense
								disablePadding
							>
								{department.doctors.map((doctor, index) => (
									<ListItem
										key={`${doctor.fullName}-${index}`}
										disableGutters
									>
										<ListItemText
											primary={
												<Typography
													color="primary"
													variant="h6"
												>
													{doctor.fullName}
												</Typography>
											}
											secondary={doctor.specialization}
										/>
									</ListItem>
								))}
							</List>
						)}
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
}
