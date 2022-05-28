import React from 'react';
import ReactDOM from 'react-dom';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { NewTab } from './NewTab';

import { ExtensionSettingsProvider } from '../../context/extensionSettings';

import './styles.css';

ReactDOM.render(
	<React.StrictMode>
		<MantineProvider
			styles={{
				Select: (theme) => ({
					hovered: {
						backgroundColor: theme.colors.gray[2],
						color: theme.colors.dark[9],
					},
					selected: {
						backgroundColor: theme.colors.gray[2],
						color: theme.colors.dark[9],
					},
				}),

				Modal: (theme) => ({
					title: {
						fontSize: theme.headings.sizes.h3.fontSize,
						fontWeight: 'bold',
					},
					close: {
						color: theme.colors.red[6],

						'&:hover': {
							backgroundColor: theme.colors.gray[2],
						},
					},
				}),
			}}
		>
			<NotificationsProvider position="top-right">
				<ExtensionSettingsProvider>
					<NewTab />
				</ExtensionSettingsProvider>
			</NotificationsProvider>
		</MantineProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
