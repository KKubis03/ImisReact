import React, { type ReactNode } from "react";
import { Accordion, AccordionDetails, Box } from "@mui/material";
import FilterAccordionSummary from "./FilterAccordionSummary";

interface FilterWrapperProps {
	expanded: boolean;
	onExpandedChange: (expanded: boolean) => void;
	onClearAll: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children: ReactNode;
}
const FilterWrapper: React.FC<FilterWrapperProps> = ({
	expanded,
	onExpandedChange,
	onClearAll,
	children,
}) => {
	return (
		<Accordion
			expanded={expanded}
			onChange={(_, isExpanded) => onExpandedChange(isExpanded)}
			sx={{ mb: 3 }}
		>
			<FilterAccordionSummary
				filtersExpanded={expanded}
				onClearAll={onClearAll}
			/>
			<AccordionDetails>
				<Box
					sx={{
						display: "flex",
						gap: 2,
						flexWrap: "wrap",
						"& > *": {
							flex: "1 1 200px",
							minWidth: "200px",
						},
					}}
				>
					{children}
				</Box>
			</AccordionDetails>
		</Accordion>
	);
};
export default FilterWrapper;
