import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Tooltip,
} from "@mui/material";

interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
	loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	onClose,
	onConfirm,
	title = "Confirm Delete",
	description = "Are you sure you want to delete this item? This action cannot be undone.",
	loading = false,
	cancelButtonText = "Cancel",
	confirmButtonText = "Delete",
}) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="delete-dialog-title"
			disableScrollLock
		>
			<DialogTitle id="delete-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{description}</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ pb: 2, px: 3 }}>
				<Tooltip title={cancelButtonText}>
					<Button
						onClick={onClose}
						color="primary"
						variant="outlined"
						disabled={loading}
					>
						{cancelButtonText}
					</Button>
				</Tooltip>
				<Tooltip title={confirmButtonText}>
					<Button
						onClick={onConfirm}
						color="error"
						variant="contained"
						disabled={loading}
						autoFocus
					>
						{loading ? `${confirmButtonText}...` : confirmButtonText}
					</Button>
				</Tooltip>
			</DialogActions>
		</Dialog>
	);
};
export default ConfirmDialog;
