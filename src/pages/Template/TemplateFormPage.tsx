import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, FormControlLabel, Switch } from "@mui/material";
import FormWrapper from "../../components/forms/FormWrapper";
import { TemplateService } from "../../api/services/template.service";
import {
	validateName,
	validateDescription,
	validateHtmlContent,
	validateTemplateType,
	validateTemplateCode,
} from "../../utils/validators";
import TemplateEditorSwitcher from "../../components/switchers/TemplateEditorSwitcher";
import LoadingCircle from "../../components/ui/LoadingCircle";

export default function TemplateFormPage() {
	const { id } = useParams<{ id: string }>();
	const isEditMode = !!id;
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [type, setType] = useState<"DOCUMENT" | "CMS">("DOCUMENT");
	const [description, setDescription] = useState("");
	const [htmlContent, setHtmlContent] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(isEditMode);
	const [errors, setErrors] = useState({
		name: "",
		type: "",
		code: "",
		description: "",
		htmlContent: "",
	});

	useEffect(() => {
		if (isEditMode) loadTemplate();
	}, [id]);

	const loadTemplate = async () => {
		if (!id) return;
		try {
			setLoadingData(true);
			const response = await TemplateService.getById(Number(id));
			setName(response.name);
			setType(response.type as "DOCUMENT" | "CMS");
			setDescription(response.description);
			setHtmlContent(response.htmlContent);
		} catch (error: any) {
			setError("Failed to load document template");
		} finally {
			setLoadingData(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = {
			name: validateName(name),
			code: !isEditMode ? validateTemplateCode(code) : "",
			type: !isEditMode ? validateTemplateType(type) : "",
			description: validateDescription(description),
			htmlContent: validateHtmlContent(htmlContent),
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
				await TemplateService.update({
					id: Number(id),
					name,
					description,
					htmlContent,
				});
				setSuccess("Document template updated successfully!");
			} else {
				await TemplateService.create({
					name,
					code,
					type,
					description,
					htmlContent,
				});
				setSuccess("Document template created successfully!");
			}
			setTimeout(() => navigate(-1), 500);
		} catch (error: any) {
			setError(
				isEditMode
					? "Failed to update document template"
					: "Failed to create document template",
			);
		} finally {
			setLoading(false);
		}
	};

	if (loadingData) return <LoadingCircle />;

	return (
		<FormWrapper
			title={isEditMode ? "Edit Template" : "Add New Template"}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isLoading={loading}
			error={error}
			success={success}
		>
			<TextField
				fullWidth
				label="Name"
				value={name}
				onChange={(e) => {
					setName(e.target.value);
					setErrors((prev) => ({
						...prev,
						name: validateName(e.target.value),
					}));
				}}
				margin="normal"
				required
				error={!!errors.name}
				helperText={errors.name}
			/>
			{!isEditMode && (
				<TextField
					fullWidth
					label="Code"
					value={code}
					onChange={(e) => {
						setCode(e.target.value);
						setErrors((prev) => ({
							...prev,
							code: validateTemplateCode(e.target.value),
						}));
					}}
					margin="normal"
					required
					error={!!errors.code}
					helperText={errors.code}
				/>
			)}
			<TextField
				fullWidth
				label="Description"
				value={description}
				onChange={(e) => {
					setDescription(e.target.value);
					setErrors((prev) => ({
						...prev,
						description: validateDescription(e.target.value),
					}));
				}}
				margin="normal"
				multiline
				rows={3}
				required
				error={!!errors.description}
				helperText={errors.description}
			/>
			{!isEditMode && (
				<FormControlLabel
					sx={{ mt: 1 }}
					control={
						<Switch
							checked={type === "CMS"}
							onChange={(e) => {
								const nextType = e.target.checked ? "CMS" : "DOCUMENT";
								setType(nextType);
								setErrors((prev) => ({
									...prev,
									type: validateTemplateType(nextType),
								}));
							}}
						/>
					}
					label={`Type: ${type === "CMS" ? "CMS Page" : "Document"}`}
				/>
			)}
			<TemplateEditorSwitcher
				key={type}
				type={type}
				value={htmlContent}
				onChange={(content: string) => {
					setHtmlContent(content);
					setErrors((prev) => ({
						...prev,
						htmlContent: validateHtmlContent(content),
					}));
				}}
				error={errors.htmlContent}
				label="HTML Content"
				required
			/>
		</FormWrapper>
	);
}
