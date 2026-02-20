import { useEffect, useState } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import CmsRenderer from "../components/cms/CmsRenderer";
import { TemplateService } from "../api/services/template.service";
import { useLocation } from "react-router-dom";
import { PATHS } from "../routes/paths";

export default function CMSPage() {
	const [htmlContent, setHtmlContent] = useState<string>("");
	const [code, setCode] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	useEffect(() => {
		setLoading(true);
		setHtmlContent("");
		if (location.pathname == PATHS.ABOUT) {
			setCode("CMS_ABOUT");
		} else if (location.pathname == PATHS.CONTACT) {
			setCode("CMS_CONTACT");
		} else if (location.pathname == PATHS.HOME) {
			setCode("CMS_HOME");
		} else if (location.pathname == PATHS.SERVICES) {
			setCode("CMS_SERVICES");
		}
	}, [location.pathname]);
	useEffect(() => {
		if (!code) return;
		TemplateService.getHtmlContentByCode(code)
			.then((res) => {
				const data = typeof res === "string" ? res : res.htmlContent;
				setHtmlContent(data || "");
			})
			.finally(() => setLoading(false));
	}, [code]);
	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{loading ? (
					<Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
						<CircularProgress />
					</Box>
				) : (
					<CmsRenderer html={htmlContent} />
				)}
			</Container>
		</Box>
	);
}
