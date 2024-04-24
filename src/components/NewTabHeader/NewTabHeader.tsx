import { Button, Grid, Group, Menu, Title, Text } from '@mantine/core';
import { BookmarkIcon, CogIcon, CollectionIcon, PlusIcon } from '@heroicons/react/outline';

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
									leftIcon={<PlusIcon style={{ width: 18, height: 18 }} />}
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
									icon={<BookmarkIcon style={{ width: 14, height: 14 }} />}
									className={classes.headerButton}
									onClick={onNewBookmarkClick}
								>
									New Bookmark
								</Menu.Item>

								<Menu.Item
									icon={<CollectionIcon style={{ width: 14, height: 14 }} />}
									className={classes.headerButton}
									onClick={onNewCategoryClick}
								>
									New Category
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>

						<Button
							variant="subtle"
							leftIcon={
								constants.availableViews.find((view) => view.id === currentView)
									?.icon
							}
							compact
							color="dark"
							className={classes.headerButton}
							onClick={handleNextView}
						>
							<Text inline size="sm">{`${
								constants.availableViews.find((view) => view.id === currentView)
									?.title
							} view`}</Text>
						</Button>

						<Button
							variant="subtle"
							leftIcon={<CogIcon style={{ width: 18, height: 18 }} />}
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
