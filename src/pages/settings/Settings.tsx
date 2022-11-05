import { Box, Title, Text } from '@mantine/core';

import { CategoriesBookmarksSection } from '@components/Settings/CategoriesBookmarksSection';
import { CapsulesSection } from '@components/Settings/CapsulesSection';
import { ListSection } from '@components/Settings/ListSection';
import { ThemeSection } from '@components/Settings/ThemeSection';

import { useSettingsViewStyles } from './Settings.styles';

export const Settings = () => {
	const { classes } = useSettingsViewStyles();

	return (
		<Box className={classes.settingsLayout}>
			<Title mb={32}>Simple Start - Settings</Title>

			<Box>
				<Title order={3} mb={0} sx={{ fontWeight: 600 }}>
					Theme
				</Title>
				<Text mb={16} color="dimmed">
					Select between pre-defined themes (dark and light), or create your own custom
					theme for the extension!
				</Text>

				<ThemeSection />
			</Box>

			<Box>
				<Title order={3} mb={0} sx={{ fontWeight: 600 }}>
					Capsule View
				</Title>
				<Text mb={16} color="dimmed">
					Customize the look and feel of the capsule view!
				</Text>

				<CapsulesSection />
			</Box>

			<Box>
				<Title order={3} mb={8} sx={{ fontWeight: 600 }}>
					List View
				</Title>
				<Text mb={16} color="dimmed">
					Customize the look and feel of the list view!
				</Text>

				<ListSection />
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
