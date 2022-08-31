import { MantineProvider, Global } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { Settings } from './Settings';

import { ExtensionSettingsProvider } from '../../context/extensionSettings';

import { themeColors } from '../../themeColors';
import { themeComponents } from '../../themeComponents';
import { useExtensionTheme } from '../../hooks/useExtensionTheme';

export const Root = () => {
	const { theme } = useExtensionTheme({ key: 'simpleStartTheme', defaultValue: 'light' });

	return (
		<MantineProvider
			theme={{
				...themeComponents,
				...themeColors[theme],
				primaryColor: theme === 'dark' || theme === 'light' ? 'blue' : 'custom-theme',
			}}
		>
			<Global
				styles={(theme) => ({
					html: {
						color: theme.colors.text,
					},
					body: {
						backgroundColor: theme.colors.background[0],
					},
				})}
			/>
			<NotificationsProvider position="top-right">
				<ExtensionSettingsProvider>
					<Settings />
				</ExtensionSettingsProvider>
			</NotificationsProvider>
		</MantineProvider>
	);
};
