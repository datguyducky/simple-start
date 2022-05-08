import { Button, Grid, Group, Menu, Title } from '@mantine/core';
import { BookmarkIcon, CogIcon, CollectionIcon, PlusIcon } from '@heroicons/react/outline';

type NewTabHeaderProps = {
	onNewBookmarkClick: () => void;
	onNewCategoryClick: () => void;
};

export const NewTabHeader = ({ onNewBookmarkClick, onNewCategoryClick }: NewTabHeaderProps) => {
	return (
		<Grid columns={3} style={{ marginBottom: 32 }}>
			<Grid.Col span={1}>
				<Title>Simple Start</Title>
			</Grid.Col>

			<Grid.Col span={1} offset={1}>
				<Group position="right" spacing="xs">
					<Menu
						control={
							<Button
								variant="subtle"
								leftIcon={<PlusIcon style={{ width: 14, height: 14 }} />}
								compact
								color="dark"
								sx={(theme) => ({
									'&:hover': {
										backgroundColor: theme.colors.gray[2],
									},
								})}
							>
								Add
							</Button>
						}
						withArrow
					>
						<Menu.Item
							icon={<BookmarkIcon style={{ width: 14, height: 14 }} />}
							sx={(theme) => ({
								'&:hover': {
									backgroundColor: theme.colors.gray[2],
								},
							})}
							onClick={onNewBookmarkClick}
						>
							New Bookmark
						</Menu.Item>
						<Menu.Item
							icon={<CollectionIcon style={{ width: 14, height: 14 }} />}
							sx={(theme) => ({
								'&:hover': {
									backgroundColor: theme.colors.gray[2],
								},
							})}
							onClick={onNewCategoryClick}
						>
							New Category
						</Menu.Item>
					</Menu>

					<Button
						variant="subtle"
						leftIcon={<CogIcon style={{ width: 14, height: 14 }} />}
						compact
						color="dark"
						sx={(theme) => ({
							'&:hover': {
								backgroundColor: theme.colors.gray[2],
							},
						})}
						onClick={async () =>
							await browser.runtime
								.openOptionsPage()
								.then(() => console.log('did work?'))
								.catch((error) => console.error(error))
						}
					>
						Settings
					</Button>
				</Group>
			</Grid.Col>
		</Grid>
	);
};
