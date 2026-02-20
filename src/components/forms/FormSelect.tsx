import { TextField, MenuItem } from "@mui/material";
import type { SelectListItem } from "../../api/types/pagination";

interface FormSelectProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: SelectListItem[];
	error?: string;
	required?: boolean;
	disabled?: boolean;
	helperText?: string;
}

export const FormSelect = ({
	label,
	value,
	onChange,
	options,
	error,
	required,
	disabled,
	helperText,
}: FormSelectProps) => (
	<TextField
		fullWidth
		select
		label={label}
		value={value}
		onChange={(e) => onChange(e.target.value)}
		margin="normal"
		required={required}
		disabled={disabled}
		error={!!error}
		helperText={error || helperText}
	>
		{options.map((option) => (
			<MenuItem
				key={option.id}
				value={option.id}
			>
				{option.displayName}
			</MenuItem>
		))}
	</TextField>
);
