import { MantineProvider, Global } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { NewTab } from './NewTab';
import { NotificationsProvider } from '@mantine/notifications';
import { ExtensionSettingsProvider } from '../../context/extensionSettings';

import { themeColors } from '../../themeColors';
import { themeComponents } from '../../themeComponents';

import { useExtensionTheme } from '../../hooks/useExtensionTheme';

export const Root = () => {
	const [theme] = useExtensionTheme({ key: 'simpleStartTheme', defaultValue: 'light' });

	return (
		<MantineProvider
			theme={{
				...themeComponents,
				...themeColors[theme],
				primaryColor: theme === 'dark' || theme === 'light' ? 'blue' : 'red', // todo: change red to primary from custom theme
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
					<NewTab />
				</ExtensionSettingsProvider>
			</NotificationsProvider>
		</MantineProvider>
	);
};
