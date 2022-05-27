import React from 'react';
import ReactDOM from 'react-dom';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { NewTab } from './NewTab';

import { ExtensionSettingsProvider } from '../../context/extensionSettings';

import './styles.css';

ReactDOM.render(
	<React.StrictMode>
		<MantineProvider>
			<NotificationsProvider position="top-right">
				<ExtensionSettingsProvider>
					<NewTab />
				</ExtensionSettingsProvider>
			</NotificationsProvider>
		</MantineProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
