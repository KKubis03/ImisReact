import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { SettingsService } from "../../api/services/settings.service";
import LoadingCircle from "../../components/ui/LoadingCircle";
import FormWrapper from "../../components/forms/FormWrapper";
import { FormInput } from "../../components/forms/FormInput";
import {
	validateSettingKey,
	validateSettingValue,
	validateDescription,
} from "../../utils/validators";

export default function SettingFormPage() {
	const { id } = useParams<{ id: string }>();
	const isEditMode = !!id;
	const navigate = useNavigate();

	const [settingKey, setSettingKey] = useState("");
	const [settingValue, setSettingValue] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(isEditMode);
	const [errors, setErrors] = useState({
		settingKey: "",
		settingValue: "",
		description: "",
	});

	useEffect(() => {
		if (isEditMode) loadSetting();
	}, [id]);

	const loadSetting = async () => {
		if (!id) return;
		try {
			setLoadingData(true);
			const response = await SettingsService.getById(Number(id));
			setSettingKey(response.settingKey);
			setSettingValue(response.settingValue);
			setDescription(response.description);
		} catch (error: any) {
			setError("Failed to load setting");
		} finally {
			setLoadingData(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = {
			settingKey: validateSettingKey(settingKey),
			settingValue: validateSettingValue(settingValue),
			description: validateDescription(description, 5),
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
				await SettingsService.update(Number(id), {
					id: Number(id),
					settingKey,
					settingValue,
					description,
				});
				setSuccess("Setting updated successfully!");
			} else {
				await SettingsService.create({ settingKey, settingValue, description });
				setSuccess("Setting created successfully!");
			}
			setTimeout(() => navigate(PATHS.SETTINGS), 2000);
		} catch (error: any) {
			setError(
				isEditMode ? "Failed to update setting" : "Failed to create setting",
			);
		} finally {
			setLoading(false);
		}
	};

	if (loadingData) return <LoadingCircle />;

	return (
		<FormWrapper
			title={isEditMode ? "Edit Setting" : "Add New Setting"}
			onSubmit={handleSubmit}
			onCancel={() => navigate(PATHS.SETTINGS)}
			isLoading={loading}
			error={error}
			success={success}
			submitLabel={isEditMode ? "Update" : undefined}
		>
			<FormInput
				label="Setting Key"
				value={settingKey}
				error={errors.settingKey}
				required
				onChange={(val) => {
					setSettingKey(val);
					setErrors((prev) => ({
						...prev,
						settingKey: validateSettingKey(val),
					}));
				}}
			/>
			<FormInput
				label="Setting Value"
				value={settingValue}
				error={errors.settingValue}
				required
				onChange={(val) => {
					setSettingValue(val);
					setErrors((prev) => ({
						...prev,
						settingValue: validateSettingValue(val),
					}));
				}}
			/>
			<FormInput
				label="Description"
				value={description}
				error={errors.description}
				multiline
				rows={4}
				required
				onChange={(val) => {
					setDescription(val);
					setErrors((prev) => ({
						...prev,
						description: validateDescription(val),
					}));
				}}
			/>
		</FormWrapper>
	);
}
