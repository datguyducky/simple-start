import { MenuIcon, ServerIcon } from '@heroicons/react/outline';

export const constants = {
	availableViews: [
		{
			id: 1,
			icon: <ServerIcon style={{ width: 18, height: 18 }} />,
			title: 'Capsules',
		},
		{
			id: 3,
			icon: <MenuIcon style={{ width: 18, height: 18 }} />,
			title: 'List',
		},
	],
};
