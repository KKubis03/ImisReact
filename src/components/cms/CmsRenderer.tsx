import parse, { type HTMLReactParserOptions, Element } from "html-react-parser";
import { Box, Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router";
import { PATHS } from "../../routes/paths";
import ContactInfo from "./ContactInfo";
import DepartmentsWithDoctors from "./DepartmentsWithDoctors";
import PriceList from "./PriceList";

export default function CmsRenderer({ html }: { html: string }) {
	const navigate = useNavigate();

	const options: HTMLReactParserOptions = {
		replace: (domNode) => {
			if (
				!(domNode instanceof Element) ||
				!domNode.attribs?.["data-component"]
			) {
				return;
			}

			const componentName = domNode.attribs["data-component"];

			switch (componentName) {
				case "ContactInfo":
					return <ContactInfo />;

				case "DepartmentList":
					return <DepartmentsWithDoctors />;

				case "PriceList":
					return <PriceList />;

				case "ContactButton":
					return (
						<Tooltip
							title="Contact us for more information"
							sx={{ mt: 2, mb: 2 }}
						>
							<Button
								variant="contained"
								size="large"
								onClick={() => navigate(PATHS.CONTACT)}
							>
								Contact Us
							</Button>
						</Tooltip>
					);

				case "HeroButtons":
					return (
						<Box
							sx={{ display: "flex", gap: 2, justifyContent: "start", mt: 4 }}
						>
							<Tooltip
								title="Start using IMIS"
								sx={{ mt: 2, mb: 2 }}
							>
								<Button
									variant="contained"
									size="large"
									onClick={() => navigate(PATHS.LOGIN)}
								>
									Get Started
								</Button>
							</Tooltip>
							<Tooltip
								title="Learn more about IMIS"
								sx={{ mt: 2, mb: 2 }}
							>
								<Button
									variant="outlined"
									size="large"
									onClick={() => navigate(PATHS.ABOUT)}
								>
									Learn More
								</Button>
							</Tooltip>
						</Box>
					);

				default:
					return <div>Component {componentName} does not exist</div>;
			}
		},
	};

	return <div className="cms-content">{parse(html, options)}</div>;
}
