import { MantineThemeOverride } from '@mantine/core';

export const themeComponents: MantineThemeOverride = {
	components: {
		Select: {
			styles: (theme) => ({
				hovered: {
					backgroundColor: theme.colors.background[2],
				},

				// fix for Select component of having a horizontal scroll after upgrading to v5
				// + normal styling for selected and hovered component, and a little bit hacky way
				// to style selected components that's also hovered
				item: {
					borderRadius: 0,
					color: theme.colors.text,

					'&[data-selected]': {
						backgroundColor: theme.colors.background[2],
						color: theme.colors.text,

						'&[data-hovered]': {
							backgroundColor: theme.colors.background[2],
							color: theme.colors.text,
						},
					},
					'&[data-hovered]': {
						backgroundColor: theme.colors.background[2],
						color: theme.colors.text,
					},
				},

				// fix for Select component of having a horizontal scroll after upgrading to v5
				dropdown: {
					backgroundColor: theme.colors.background[0],
					borderColor: theme.colors.background[2],

					'& > div > div > div > div > div': {
						padding: '0px !important',
					},
				},

				nothingFound: {
					color: theme.colors.background[5],
				},

				rightSection: {
					'& > button': {
						color: theme.colors.background[7],
					},
				},
			}),
		},
		Modal: {
			styles: (theme) => ({
				modal: {
					backgroundColor: theme.colors.background[0],
				},
				title: {
					fontSize: theme.headings.sizes.h3.fontSize,
					color: theme.colors.text,
					fontWeight: 'bold',
				},
				close: {
					color: theme.colors.red[6],

					'&[data-hovered]': {
						backgroundColor: theme.colors.background[2],
					},
				},
			}),
		},
		Title: {
			styles: (theme) => ({
				root: {
					color: theme.colors.text,
				},
			}),
		},
		Input: {
			styles: (theme, params) => ({
				input: {
					backgroundColor:
						params.variant === 'unstyled' ? 'transparent' : theme.colors.background[0],
					borderColor:
						params.variant === 'unstyled' ? 'transparent' : theme.colors.background[4],

					'&::placeholder': {
						color: theme.colors.background[5],
					},
					color: theme.colors.text,
				},
				rightSection: {
					color: theme.colors.background[6],

					'& > svg': {
						color: 'inherit !important',
					},
				},
			}),
		},
		InputWrapper: {
			styles: (theme) => ({
				label: {
					color: theme.colors.text,
				},
			}),
		},
		Checkbox: {
			styles: (theme) => ({
				input: {
					backgroundColor: theme.colors.background[0],
					borderColor: theme.colors.background[4],
				},
				label: {
					color: theme.colors.text,
				},
			}),
		},
		Menu: {
			styles: (theme) => ({
				itemLabel: {
					color: theme.colors.text,
				},
				itemIcon: {
					color: theme.colors.text,
				},
			}),
		},
		Text: {
			styles: (theme, params) => ({
				root: {
					color:
						params?.color === 'dimmed' ? theme.colors.background[6] : theme.colors.text,
				},
			}),
		},
		Accordion: {
			styles: (theme) => ({
				chevron: {
					color: theme.colors.text,
				},
				control: {
					backgroundColor: theme.colors.background[1],

					'&:hover': {
						backgroundColor: theme.colors.background[2],
					},
				},
				item: {
					backgroundColor: theme.colors.background[1],
					'&[data-active]': { borderColor: theme.colors.background[3] },
					'&[data-active] .mantine-Accordion-control': {
						backgroundColor: theme.colors.background[1],
						borderBottom: `1px solid ${theme.colors.background[3]}`,

						'&:hover': {
							backgroundColor: theme.colors.background[2],
						},
					},
				},
				panel: {
					backgroundColor: theme.colors.background[0],
				},
				label: {
					color: theme.colors.text,
				},
			}),
		},
		ActionIcon: {
			styles: (theme) => ({
				root: {
					'&:hover': {
						backgroundColor: theme.colors.background[3],
					},
				},
			}),
		},
		Overlay: {
			styles: () => ({
				root: {
					opacity: '0.6 !important',
				},
			}),
		},
	},
};
