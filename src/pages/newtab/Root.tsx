import { MantineProvider, Global } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { NewTab } from './NewTab';

import { useExtensionTheme } from '@hooks/useExtensionTheme';

import { ExtensionSettingsProvider } from '../../context/extensionSettings';

import { themeColors } from '../../themeColors';
import { themeComponents } from '../../themeComponents';

export const Root = () => {
	const { theme, customThemes } = useExtensionTheme({
		key: 'simpleStartTheme',
		defaultValue: 'light',
	});

	const { name, ...selectedCustomTheme } = customThemes?.find(({ name }) => name === theme) || {};

	return (
		<MantineProvider
			theme={{
				...themeComponents,
				...(theme?.includes('created-theme')
					? name !== undefined
						? selectedCustomTheme
						: themeColors['light']
					: (themeColors as any)[theme as string]),
				primaryColor:
					theme === 'dark' || theme === 'light' || name === undefined
						? 'blue'
						: 'custom-primary',
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
