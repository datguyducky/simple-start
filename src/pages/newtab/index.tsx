import React from 'react';
import ReactDOM from 'react-dom';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { NewTab } from './NewTab';

import { ExtensionViewProvider } from '../../context/extensionView';

import './styles.css';

ReactDOM.render(
	<React.StrictMode>
		<MantineProvider>
			<NotificationsProvider position="top-right">
				<ExtensionViewProvider>
					<NewTab />
				</ExtensionViewProvider>
			</NotificationsProvider>
		</MantineProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
