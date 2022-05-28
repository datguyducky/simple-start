import { Button, Grid, Group, Menu, Title, Text } from '@mantine/core';
import { BookmarkIcon, CogIcon, CollectionIcon, PlusIcon } from '@heroicons/react/outline';

import { constants } from '../../common/constants';

import { useExtensionSettings } from '../../hooks/useExtensionSettings';

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
				<Title>Simple Start</Title>
			</Grid.Col>

			{!viewLoading && (
				<Grid.Col span={1} offset={1}>
					<Group position="right" spacing="xs">
						<Menu
							control={
								<Button
									variant="subtle"
									leftIcon={<PlusIcon style={{ width: 18, height: 18 }} />}
									compact
									color="dark"
									className={classes.headerButton}
								>
									<Text size="sm" inline mt={3}>
										Add
									</Text>
								</Button>
							}
							withArrow
						>
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
							<Text inline size="sm" mt={3}>{`${
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
							onClick={async () =>
								await browser.runtime
									.openOptionsPage()
									.then(() => console.log('did work?'))
									.catch((error) => console.error(error))
							}
						>
							<Text inline size="sm" mt={3}>
								Settings
							</Text>
						</Button>
					</Group>
				</Grid.Col>
			)}
		</Grid>
	);
};
