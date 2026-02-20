import { AccordionSummary, Button, Tooltip, Typography } from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FilterAccordionProps {
	filtersExpanded: boolean;
	onClearAll: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const FilterAccordionSummary: React.FC<FilterAccordionProps> = ({
	filtersExpanded,
	onClearAll,
}) => {
	const handleClearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		onClearAll(e);
	};
	return (
		<AccordionSummary
			expandIcon={<ExpandMoreIcon />}
			aria-controls="filters-content"
			id="filters-header"
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			<Typography variant="subtitle1">Filters</Typography>
			{filtersExpanded && (
				<Tooltip title="Clear all filters">
					<Button
						component="span"
						size="small"
						onClick={handleClearClick}
						sx={{
							ml: "auto",
							mr: 2,
							position: "relative",
							zIndex: 1,
						}}
					>
						Clear All
					</Button>
				</Tooltip>
			)}
		</AccordionSummary>
	);
};

export default FilterAccordionSummary;
