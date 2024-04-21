import { createStyles } from '@mantine/core';

export const useCategoriesBookmarksSectionStyles = createStyles((theme) => ({
	categoriesAccordionItem: {
		'&[data-active] .mantine-Accordion-control': {
			backgroundColor: theme.colors.background[1],
			borderBottom: `1px solid ${theme.colors.background[3]}`,
		},
	},

	categoriesAccordionControl: {
		padding: '8px 16px',
	},

	categoriesAccordionContent: {
		paddingBottom: 8,
		paddingRight: 11,

		padding: 0,
	},

	categoriesAccordionChevron: {
		marginLeft: 8,
	},
}));
