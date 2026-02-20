import { TextField } from "@mui/material";

interface FormInputProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	error?: string;
	required?: boolean;
	shrink?: boolean;
	multiline?: boolean;
	rows?: number;
}

export const FormInput = ({
	label,
	value,
	onChange,
	type = "text",
	error,
	required,
	shrink,
	multiline = false,
	rows,
}: FormInputProps) => (
	<TextField
		fullWidth
		label={label}
		type={type}
		value={value}
		onChange={(e) => onChange(e.target.value)}
		multiline={multiline}
		rows={rows}
		margin="normal"
		required={required}
		error={!!error}
		helperText={error}
		InputLabelProps={shrink ? { shrink: true } : undefined}
	/>
);
