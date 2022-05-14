import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

import { NewTab } from './NewTab';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

ReactDOM.render(
	<React.StrictMode>
		<MantineProvider>
			<NotificationsProvider position="top-right">
				<NewTab />
			</NotificationsProvider>
		</MantineProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
