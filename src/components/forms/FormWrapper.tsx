import React, { type ReactNode } from "react";
import {
	Paper,
	Typography,
	Alert,
	Box,
	Tooltip,
	Button,
	Container,
} from "@mui/material";

interface FormWrapperProps {
	title: string;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
	isLoading?: boolean;
	error?: string | null;
	success?: string | null;
	children: ReactNode;
	submitLabel?: string;
	cancelLabel?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
	title,
	onSubmit,
	onCancel,
	isLoading = false,
	error,
	success,
	children,
	submitLabel = "Save",
	cancelLabel = "Cancel",
}) => {
	return (
		<Container
			maxWidth="md"
			sx={{ mt: 10, mb: 6 }}
		>
			<Paper sx={{ p: 4 }}>
				<Typography
					variant="h4"
					color="primary"
					gutterBottom
				>
					{title}
				</Typography>
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
					onSubmit={onSubmit}
					sx={{ mt: 3 }}
				>
					{children}
					<Box sx={{ mt: 3, display: "flex", gap: 2 }}>
						<Tooltip title={submitLabel}>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={isLoading}
							>
								{isLoading ? "Processing..." : submitLabel}
							</Button>
						</Tooltip>
						<Tooltip title={cancelLabel}>
							<Button
								variant="outlined"
								onClick={onCancel}
								disabled={isLoading}
							>
								{cancelLabel}
							</Button>
						</Tooltip>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default FormWrapper;
