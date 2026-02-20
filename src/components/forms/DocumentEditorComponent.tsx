import { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";

interface TinyDocumentEditorComponentProps {
	value: string;
	onChange: (content: string) => void;
	error?: string;
	label?: string;
	required?: boolean;
	height?: number;
}

export default function DocumentEditorComponent({
	value,
	onChange,
	error,
	label = "HTML Content",
	required = true,
	height = 700,
}: TinyDocumentEditorComponentProps) {
	const editorRef = useRef<any>(null);

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
					border: "1px solid #ddd",
					borderRadius: 1,
					overflow: "hidden",
					bgcolor: "#f5f5f5",
				}}
			>
				<Editor
					apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
					onInit={(_evt: any, editor: any) => {
						editorRef.current = editor;
					}}
					value={value}
					onEditorChange={onChange}
					init={{
						height: height,
						menubar: "edit view insert format table",
						plugins: [
							"advlist",
							"autolink",
							"lists",
							"link",
							"image",
							"charmap",
							"anchor",
							"searchreplace",
							"visualblocks",
							"code",
							"fullscreen",
							"insertdatetime",
							"media",
							"table",
							"preview",
							"help",
							"wordcount",
							"pagebreak",
							"nonbreaking",
							"save",
							"directionality",
						],
						toolbar:
							"undo redo | styles | bold italic underline strikethrough | " +
							"forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
							"bullist numlist outdent indent | table | link image | " +
							"pagebreak | variables | preview code fullscreen",
						toolbar_mode: "sliding",
						style_formats: [
							{ title: "Heading 1", format: "h1" },
							{ title: "Heading 2", format: "h2" },
							{ title: "Heading 3", format: "h3" },
							{ title: "Paragraph", format: "p" },
						],
						content_style: `
              @page {
                size: A4;
                margin: 0;
              }
              body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 12pt;
                line-height: 1.6;
                color: #000;
                background: #f5f5f5;
                margin: 0;
                padding: 20px;
              }
              .mce-content-body {
                max-width: 794px;
                min-height: 1123px;
                margin: 0 auto;
                background: white;
                padding: 40px 60px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                box-sizing: border-box;
              }
              h1, h2, h3, h4, h5, h6 {
                font-weight: bold;
                margin-top: 1em;
                margin-bottom: 0.5em;
                color: #000;
              }
              h1 { font-size: 24pt; }
              h2 { font-size: 18pt; }
              h3 { font-size: 14pt; }
              p {
                margin: 0 0 1em 0;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
              }
              table td, table th {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
              }
              table th {
                background-color: #f0f0f0;
                font-weight: bold;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              /* Style for variables */
              body :not(code):not(pre) {
                color: inherit;
              }
              @media print {
                body {
                  background: white;
                  padding: 0;
                }
                .mce-content-body {
                  box-shadow: none;
                  padding: 0;
                }
              }
            `,
						table_default_attributes: {
							border: "1",
						},
						table_default_styles: {
							borderCollapse: "collapse",
							width: "100%",
						},
						pagebreak_separator:
							'<div style="page-break-after: always;"></div>',
						automatic_uploads: false,
						file_picker_types: "image",
						images_upload_handler: (_blobInfo: any, _progress: any) =>
							new Promise((_resolve, reject) => {
								reject("Image upload not configured");
							}),
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
