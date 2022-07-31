import { Box, Title, Text } from '@mantine/core';

import { useSettingsViewStyles } from './Settings.styles';

import { CategoriesBookmarksSection } from '../../features/Settings/CategoriesBookmarksSection';

export const Settings = () => {
	const { classes } = useSettingsViewStyles();

	return (
		<Box className={classes.settingsLayout}>
			<Title mb={32}>Simple Start - Settings</Title>

			<Box>
				<Title order={3} mb={8} sx={{ fontWeight: 600 }}>
					General
				</Title>
			</Box>

			<Box>
				<Title order={3} mb={8} sx={{ fontWeight: 600 }}>
					Theme
				</Title>
			</Box>

			<Box>
				<Title order={3} mb={8} sx={{ fontWeight: 600 }}>
					Capsule View
				</Title>
			</Box>

			<Box>
				<Title order={3} mb={8} sx={{ fontWeight: 600 }}>
					List View
				</Title>
			</Box>

			<Box>
				<Title order={3} mb={0} sx={{ fontWeight: 600 }}>
					Categories & Bookmarks
				</Title>
				<Text mb={16} color="dimmed">
					Manage your categories and bookmarks - edit, move and delete them
				</Text>

				<CategoriesBookmarksSection />
			</Box>
		</Box>
	);
};
