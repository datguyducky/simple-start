import { Button, Grid, Group, Menu, Title, Text } from '@mantine/core';
import { IconPlus, IconBookmark, IconBoxMultiple, IconSettings } from '@tabler/icons-react';

import { constants } from '@common/constants';

import { useExtensionSettings } from '@hooks/useExtensionSettings';

import { useNewTabHeaderStyles } from './NewTabHeader.styles';

type NewTabHeaderProps = {
	onNewBookmarkClick: () => void;
	onNewCategoryClick: () => void;
};

export const NewTabHeader = ({ onNewBookmarkClick, onNewCategoryClick }: NewTabHeaderProps) => {
	const { classes } = useNewTabHeaderStyles();

	const { currentView, handleNextView, viewLoading } = useExtensionSettings();

	const currentViewIndex = constants.availableViews.findIndex((view) => view.id === currentView);
	const nextView =
		constants.availableViews[(currentViewIndex + 1) % constants.availableViews.length];

	return (
		<Grid columns={3} style={{ marginBottom: 32 }}>
			<Grid.Col span={1}>
				<Title color="dark">Simple Start</Title>
			</Grid.Col>

			{!viewLoading && (
				<Grid.Col span={2}>
					<Group position="right" spacing="xs">
						<Menu
							withArrow
							position="top-start"
							width={200}
							classNames={{
								dropdown: classes.menuDropdown,
								arrow: classes.menuArrow,
							}}
						>
							<Menu.Target>
								<Button
									variant="subtle"
									leftIcon={<IconPlus size={18} />}
									compact
									className={classes.headerButton}
								>
									<Text size="sm" inline>
										Add
									</Text>
								</Button>
							</Menu.Target>

							<Menu.Dropdown>
								<Menu.Item
									icon={<IconBookmark size={14} />}
									className={classes.headerButton}
									onClick={onNewBookmarkClick}
								>
									New Bookmark
								</Menu.Item>

								<Menu.Item
									icon={<IconBoxMultiple size={14} />}
									className={classes.headerButton}
									onClick={onNewCategoryClick}
								>
									New Category
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>

						<Button
							variant="subtle"
							leftIcon={nextView?.icon}
							compact
							color="dark"
							className={classes.headerButton}
							onClick={handleNextView}
						>
							<Text inline size="sm">{`${nextView?.title} view`}</Text>
						</Button>

						<Button
							variant="subtle"
							leftIcon={<IconSettings size={18} />}
							compact
							color="dark"
							className={classes.headerButton}
							onClick={async () => await chrome.runtime.openOptionsPage()}
						>
							<Text inline size="sm">
								Settings
							</Text>
						</Button>
					</Group>
				</Grid.Col>
			)}
		</Grid>
	);
};
