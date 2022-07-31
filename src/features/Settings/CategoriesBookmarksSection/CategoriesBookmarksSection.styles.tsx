import { createStyles } from '@mantine/core';

export const useCategoriesBookmarksSectionStyles = createStyles((theme) => ({
	categoriesAccordionItem: {
		'&[data-active] .mantine-Accordion-control': {
			backgroundColor: theme.colors.gray[1],
			borderBottom: '1px solid #dee2e6',
		},
	},

	categoriesAccordionControl: {
		padding: '8px 16px',
	},

	categoriesAccordionContent: {
		paddingBottom: 8,
		paddingRight: 11,

		'& > div': {
			marginBottom: 8,
		},
	},

	categoriesAccordionChevron: {
		marginLeft: 8,
	},
}));
