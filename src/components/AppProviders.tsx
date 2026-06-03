import { MantineProvider, Global, MantineThemeOverride } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { type ReactNode } from 'react';

import { ExtensionSettingsProvider } from '@/context/ExtensionSettingsContext';
import { ExtensionProvider } from '@/context/ExtensionRootContext';
import { useExtensionTheme } from '@/hooks/useExtensionTheme';
import { themeComponents } from '@/theme/themeComponents';
import { themeColors } from '@/theme/themeColors';

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

	const mantineTheme = {
		...themeComponents,
		...selectedTheme,
		primaryColor:
			theme === 'dark' || theme === 'light' || selectedCustomTheme === undefined
				? 'blue'
				: 'custom-primary',
	} as unknown as MantineThemeOverride;

	return (
		<MantineProvider theme={mantineTheme}>
			<Global
				styles={(theme) => ({
					html: {
						color: theme.colors.text,
						margin: 0,
						padding: 0,
						height: '100%',
					},
					body: {
						backgroundColor: theme.colors.background[0],
						margin: 0,
						padding: 0,
						height: '100%',
					},
					'#root': {
						height: '100%',
					},
				})}
			/>

			<NotificationsProvider position="top-center">
				<ExtensionSettingsProvider>
					<ExtensionProvider>{children}</ExtensionProvider>
				</ExtensionSettingsProvider>
			</NotificationsProvider>
		</MantineProvider>
	);
};
