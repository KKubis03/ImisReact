import DocumentEditorComponent from "../forms/DocumentEditorComponent";
import CMSEditorComponent from "../forms/CMSEditorComponent";

interface TemplateEditorProps {
	type: "DOCUMENT" | "CMS" | string;
	value: string;
	onChange: (content: string) => void;
	label?: string;
	error?: string;
	required?: boolean;
}

export default function TemplateEditorSwitcher({
	type,
	...props
}: TemplateEditorProps) {
	if (type === "CMS") {
		return <CMSEditorComponent {...props} />;
	}

	return <DocumentEditorComponent {...props} />;
}
