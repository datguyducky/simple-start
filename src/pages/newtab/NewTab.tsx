import { useState } from 'react';
import { Button, Grid, Group, Menu, Text, Title, Modal } from '@mantine/core';
import { CogIcon, PlusIcon, BookmarkIcon, CollectionIcon } from '@heroicons/react/outline';

import { NewTabLayout } from './NewTab.styles';

import { NewBookmarkForm } from '../../forms/NewBookmarkForm';
import { NewCategoryForm } from '../../forms/NewCategoryForm';

export const NewTab = () => {
	const [newBookmarkModal, setNewBookmarkModal] = useState(false);
	const [newCategoryModal, setNewCategoryModal] = useState(false);

	return (
		<>
			<NewTabLayout>
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
									onClick={() => setNewBookmarkModal(true)}
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
									onClick={() => setNewCategoryModal(true)}
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
							>
								Settings
							</Button>
						</Group>
					</Grid.Col>
				</Grid>

				<div>
					<Text color="dimmed">
						Click "add" button to add your first bookmark to this view.
					</Text>
				</div>
			</NewTabLayout>

			<Modal
				opened={newBookmarkModal}
				onClose={() => setNewBookmarkModal(false)}
				centered
				title="Add new bookmark"
				size="lg"
				styles={(theme) => ({
					title: {
						fontSize: theme.headings.sizes.h3.fontSize,
						fontWeight: 'bold',
					},
					close: {
						color: theme.colors.red[6],
					},
				})}
			>
				<NewBookmarkForm />
			</Modal>

			<Modal
				opened={newCategoryModal}
				onClose={() => setNewCategoryModal(false)}
				centered
				title="Add new category"
				size="lg"
				styles={(theme) => ({
					title: {
						fontSize: theme.headings.sizes.h3.fontSize,
						fontWeight: 'bold',
					},
					close: {
						color: theme.colors.red[6],
					},
				})}
			>
				<NewCategoryForm />
			</Modal>
		</>
	);
};
