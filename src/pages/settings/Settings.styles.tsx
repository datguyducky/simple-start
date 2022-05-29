import { createStyles } from '@mantine/core';

export const useSettingsViewStyles = createStyles((theme) => ({
	settingsLayout: {
		minHeight: '100%',
		display: 'flex',
		flexDirection: 'column',
		boxSizing: 'border-box',
		padding: '32px 96px',

		[`@media (max-width: ${theme.breakpoints.xl}px)`]: {
			padding: '32px 64px',
		},

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			padding: '32px 48px',
		},

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			padding: '32px 24px',
		},
	},
}));
