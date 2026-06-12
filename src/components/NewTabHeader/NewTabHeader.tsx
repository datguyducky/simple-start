import { Button, Grid, Group, Menu, Title, Text, Box } from '@mantine/core';
import {
	IconPlus,
	IconBookmark,
	IconBoxMultiple,
	IconSettings,
	IconCapsuleHorizontal,
	IconMenu2,
} from '@tabler/icons-react';
import { browser } from 'wxt/browser';
import { useHotkeys } from '@mantine/hooks';
import { useState } from 'react';

import { constants, SHORTCUTS } from '@/common/constants';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { KeyboardShortcutsPopover } from '@/components/KeyboardShortcutsPopover';

import classes from './NewTabHeader.module.css';

type NewTabHeaderProps = {
	onNewBookmarkClick: () => void;
	onNewCategoryClick: () => void;
};

export const NewTabHeader = ({ onNewBookmarkClick, onNewCategoryClick }: NewTabHeaderProps) => {
	const { currentView, handleNextView, viewLoading, toggleOneView, toggleCapsuleIsHeart } =
		useExtensionSettings();

	const [_clickCount, setClickCount] = useState(0);

	const handleTitleClick = () => {
		setClickCount((prev) => {
			const nextCount = prev + 1;
			if (nextCount === 7) {
				handleAsyncAction(toggleCapsuleIsHeart, {
					errorTitle: 'Heart capsules could not be toggled',
				});
				return 0;
			}
			return nextCount;
		});
	};

	const currentViewIndex = constants.availableViews.findIndex((view) => view.id === currentView);
	const nextView =
		constants.availableViews[(currentViewIndex + 1) % constants.availableViews.length];

	const nextViewIcon =
		nextView.icon === 'capsules' ? (
			<IconCapsuleHorizontal size={18} />
		) : (
			<IconMenu2 size={18} />
		);

	const handleNextViewClick = () => {
		handleAsyncAction(handleNextView, {
			errorTitle: 'View could not be changed',
		});
	};

	const handleSettingsClick = () => {
		handleAsyncAction(browser.runtime.openOptionsPage, {
			errorTitle: 'Settings could not be opened',
		});
	};

	const handleToggleOneView = () => {
		handleAsyncAction(toggleOneView, {
			errorTitle: 'One view could not be toggled',
		});
	};

	useHotkeys([
		[SHORTCUTS.settings.keys, handleSettingsClick],
		[SHORTCUTS.switchView.keys, handleNextViewClick],
		[SHORTCUTS.addBookmark.keys, onNewBookmarkClick],
		[SHORTCUTS.createCategory.keys, onNewCategoryClick],
		[SHORTCUTS.toggleOneView.keys, handleToggleOneView],
	]);

	return (
		<Grid columns={3} style={{ marginBottom: 32 }}>
			<Grid.Col span={1}>
				<Box onClick={handleTitleClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
					<Title>Simple Start</Title>
				</Box>
			</Grid.Col>

			{!viewLoading && (
				<Grid.Col span={2}>
					<Group justify="flex-end" gap="xs">
						<Menu
							withArrow
							position="top-start"
							width={200}
							classNames={{
								dropdown: classes.menuDropdown,
								arrow: classes.menuArrow,
								item: classes.menuItem,
							}}
						>
							<Menu.Target>
								<Button
									variant="subtle"
									color="var(--mantine-color-text)"
									size="compact-md"
									leftSection={<IconPlus size={18} />}
									className={classes.headerButton}
								>
									<Text size="sm" fw={600} inline>
										Add
									</Text>
								</Button>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Item
									leftSection={<IconBookmark size={14} />}
									onClick={onNewBookmarkClick}
								>
									New Bookmark
								</Menu.Item>

								<Menu.Item
									leftSection={<IconBoxMultiple size={14} />}
									onClick={onNewCategoryClick}
								>
									New Category
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>

						<Button
							variant="subtle"
							color="text"
							size="compact-md"
							leftSection={nextViewIcon}
							onClick={handleNextViewClick}
							className={classes.headerButton}
						>
							<Text inline size="sm" fw={600}>{`${nextView.title} view`}</Text>
						</Button>

						<KeyboardShortcutsPopover />

						<Button
							variant="subtle"
							color="text"
							size="compact-md"
							leftSection={<IconSettings size={18} />}
							onClick={handleSettingsClick}
							className={classes.headerButton}
						>
							<Text inline size="sm" fw={600}>
								Settings
							</Text>
						</Button>
					</Group>
				</Grid.Col>
			)}
		</Grid>
	);
};
