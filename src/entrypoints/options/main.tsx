import React from 'react';
import { createRoot } from 'react-dom/client';

import { AppProviders } from '@/components/AppProviders';
import { Settings } from './Settings';

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element was not found.');
}

createRoot(rootElement).render(
	<React.StrictMode>
		<AppProviders>
			<Settings />
		</AppProviders>
	</React.StrictMode>,
);
