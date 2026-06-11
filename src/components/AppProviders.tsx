import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { type ReactNode } from 'react';

import { ExtensionSettingsProvider } from '@/context/ExtensionSettingsContext';
import { ExtensionProvider } from '@/context/ExtensionRootContext';
import { useExtensionTheme } from '@/hooks/useExtensionTheme';
import { themeColors } from '@/theme/themeColors';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { componentsOverrides } from '@/theme/themeComponents.ts';

type BuiltInTheme = keyof typeof themeColors;

const isBuiltInTheme = (theme: string): theme is BuiltInTheme => {
	return theme in themeColors;
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
	const { theme, customThemes } = useExtensionTheme({
		defaultValue: 'light',
	});

	const selectedCustomTheme = customThemes.find(({ name }) => name === theme);
	const selectedTheme =
		theme.includes('created-theme') && selectedCustomTheme !== undefined
			? selectedCustomTheme
			: isBuiltInTheme(theme)
				? themeColors[theme]
				: themeColors.light;

	const mantineTheme = createTheme({
		components: componentsOverrides,
		colors: selectedTheme.colors,
		other: {
			text: selectedTheme.other.text,
		},
		primaryColor: selectedCustomTheme !== undefined ? 'custom-primary' : 'blue',
		defaultRadius: 'sm',
		fontWeights: {
			medium: '500',
		},
	});

	return (
		<MantineProvider
			theme={mantineTheme}
			cssVariablesResolver={(theme) => {
				const textColor = theme.other.text as string;

				return {
					variables: {
						'--mantine-color-text': textColor,
						'--mantine-color-dimmed': theme.colors.background[6],
						'--mantine-color-disabled': theme.colors.background[1],
					},
					light: {
						'--mantine-color-text': textColor,
						'--mantine-color-dimmed': theme.colors.background[6],
						'--mantine-color-disabled': theme.colors.background[1],
					},
					dark: {
						'--mantine-color-text': textColor,
						'--mantine-color-dimmed': theme.colors.background[6],
						'--mantine-color-disabled': theme.colors.background[1],
					},
				};
			}}
		>
			<Notifications position="top-center" />
			<ExtensionSettingsProvider>
				<ExtensionProvider>{children}</ExtensionProvider>
			</ExtensionSettingsProvider>
		</MantineProvider>
	);
};
