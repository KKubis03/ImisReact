import { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";

interface CMSDocumentEditorComponentProps {
	value: string;
	onChange: (content: string) => void;
	error?: string;
	label?: string;
	height?: number;
	required?: boolean;
}
export default function CMSDocumentEditorComponent({
	value,
	onChange,
	error,
	label = "Treść strony (HTML)",
	height = 600,
	required = true,
}: CMSDocumentEditorComponentProps) {
	const editorRef = useRef<any>(null);

	const insertComponentPlaceholder = (componentName: string, label: string) => {
		const html = `
      <div data-component="${componentName}" 
           class="mceNonEditable" 
           style="background: #e3f2fd; padding: 20px; border: 2px dashed #1976d2; text-align: center; border-radius: 8px; margin: 10px 0;">
        <strong>[ Component: ${label} ]</strong>
      </div>
      <p>&nbsp;</p>`;
		editorRef.current.insertContent(html);
	};
	return (
		<Box sx={{ mt: 2, mb: 2 }}>
			<Typography
				variant="subtitle2"
				gutterBottom
			>
				{label} {required && "*"}
			</Typography>
			<Box
				sx={{
					border: error ? "1px solid #d32f2f" : "1px solid #ccc",
					borderRadius: 1,
					overflow: "hidden",
				}}
			>
				<Editor
					apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
					onInit={(_evt: any, editor: any) => (editorRef.current = editor)}
					value={value}
					onEditorChange={onChange}
					init={{
						height: height,
						menubar: "edit insert view format table tools",
						plugins: [
							"advlist",
							"autolink",
							"lists",
							"link",
							"image",
							"charmap",
							"preview",
							"anchor",
							"searchreplace",
							"visualblocks",
							"code",
							"fullscreen",
							"insertdatetime",
							"media",
							"table",
							"help",
							"save",
							"wordcount",
							"emoticons",
							"accordion",
							"codesample",
							"noneditable",
						],
						toolbar:
							"undo redo | blocks fontfamily | " +
							"bold italic underline strikethrough | forecolor backcolor | " +
							"alignleft aligncenter alignright alignjustify | " +
							"bullist numlist outdent indent | link image media | " +
							"insertComponent emoticons accordion | removeformat | preview code",
						extended_valid_elements:
							"div[data-component|data-*|class|style],span[data-component|data-*|class|style]",
						setup: (editor: any) => {
							editor.ui.registry.addMenuButton("insertComponent", {
								text: "Components",
								icon: "template",
								fetch: (callback: any) => {
									const items = [
										{
											type: "menuitem",
											text: "Contact Button",
											onAction: () =>
												insertComponentPlaceholder(
													"ContactButton",
													"Contact Button",
												),
										},
										{
											type: "menuitem",
											text: "Contact Info",
											onAction: () =>
												insertComponentPlaceholder(
													"ContactInfo",
													"Contact Info",
												),
										},
										{
											type: "menuitem",
											text: "Hero Buttons (Login + About)",
											onAction: () =>
												insertComponentPlaceholder(
													"HeroButtons",
													"Hero Buttons (Login + About)",
												),
										},
										{
											type: "menuitem",
											text: "List of departments with doctors",
											onAction: () =>
												insertComponentPlaceholder(
													"DepartmentList",
													"List of Departments and Doctors",
												),
										},
										{
											type: "menuitem",
											text: "Price List",
											onAction: () =>
												insertComponentPlaceholder("PriceList", "Price List"),
										},
									];
									callback(items);
								},
							});
						},
						verify_html: false,
						entity_encoding: "raw",
						codesample_global_prismjs: true,
						automatic_uploads: false,
						file_picker_types: "image",
						images_upload_handler: (_blobInfo: any, _progress: any) =>
							new Promise((_resolve, reject) => {
								reject("Image upload not configured");
							}),
						content_style: `
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                max-width: 1000px;
                margin: 2rem auto;
                padding: 0 20px;
              }
              /* Stylizacja placeholderów Twoich komponentów w edytorze */
              [data-component] {
                position: relative;
                margin: 10px 0;
                cursor: default;
              }
              [data-component]::before {
                content: "React Component";
                position: absolute;
                top: -10px;
                right: 10px;
                background: #1976d2;
                color: white;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: sans-serif;
              }
              .btn { display: inline-block; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; }
              .btn-primary { background-color: #1976d2; color: white !important; }
              .lead { font-size: 1.25rem; color: #666; }
            `,
						image_caption: true,
						media_live_embeds: true,
					}}
				/>
			</Box>
			{error && (
				<Typography
					variant="caption"
					color="error"
					sx={{ mt: 1, display: "block" }}
				>
					{error}
				</Typography>
			)}
		</Box>
	);
}
