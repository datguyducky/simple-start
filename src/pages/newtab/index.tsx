import React from 'react';
import ReactDOM from 'react-dom';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { NewTab } from './NewTab';

import { ExtensionSettingsProvider } from '../../context/extensionSettings';

import '../styles.css';

ReactDOM.render(
	<React.StrictMode>
		<MantineProvider
			// todo: move theme to file and use it both in here and in the settings index file
			theme={{
				components: {
					Select: {
						styles: (theme) => ({
							hovered: {
								backgroundColor: theme.colors.gray[2],
								color: theme.colors.dark[9],
							},

							// fix for Select component of having a horizontal scroll after upgrading to v5
							// + normal styling for selected and hovered component, and a little bit hacky way
							// to style selected components that's also hovered
							item: {
								borderRadius: 0,

								'&[data-selected]': {
									backgroundColor: theme.colors.gray[2],
									color: theme.colors.dark[9],

									'&[data-hovered]': {
										backgroundColor: theme.colors.gray[2],
										color: theme.colors.dark[9],
									},
								},
								'&[data-hovered]': {
									backgroundColor: theme.colors.gray[2],
									color: theme.colors.dark[9],
								},
							},

							// fix for Select component of having a horizontal scroll after upgrading to v5
							dropdown: {
								'& > div > div > div > div > div': { padding: '0px !important' },
							},
						}),
					},
					Modal: {
						styles: (theme) => ({
							title: {
								fontSize: theme.headings.sizes.h3.fontSize,
								fontWeight: 'bold',
							},
							close: {
								color: theme.colors.red[6],

								'&[data-hovered]': {
									backgroundColor: theme.colors.gray[2],
								},
							},
						}),
					},
				},
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
