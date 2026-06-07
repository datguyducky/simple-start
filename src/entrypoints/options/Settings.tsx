import { Box, Title, Text } from '@mantine/core';

import classes from './Settings.module.css';
import { ThemeSection } from '@/components/Settings/ThemeSection';
import { CapsulesSection } from '@/components/Settings/CapsulesSection';
import { ListSection } from '@/components/Settings/ListSection';
import { CategoriesBookmarksSection } from '@/components/Settings/CategoriesBookmarksSection';

export const Settings = () => {
	return (
		<Box className={classes.settingsLayout}>
			<Title mb={32}>Simple Start - Settings</Title>

			<Box>
				<Title order={3} mb={0}>
					Theme
				</Title>
				<Text mb={16} c="dimmed">
					Select between pre-defined themes (dark and light), or create your own custom
					theme for the extension!
				</Text>

				<ThemeSection />
			</Box>

			<Box>
				<Title order={3} mb={0}>
					Capsule View
				</Title>
				<Text mb={16} c="dimmed">
					Customize the look and feel of the capsule view!
				</Text>

				<CapsulesSection />
			</Box>

			<Box>
				<Title order={3} mb={8}>
					List View
				</Title>
				<Text mb={16} c="dimmed">
					Customize the look and feel of the list view!
				</Text>

				<ListSection />
			</Box>

			<Box>
				<Title order={3} mb={0}>
					Categories & Bookmarks
				</Title>
				<Text mb={16} c="dimmed">
					Manage your categories and bookmarks - edit, move and delete them
				</Text>

				<CategoriesBookmarksSection />
			</Box>
		</Box>
	);
};
