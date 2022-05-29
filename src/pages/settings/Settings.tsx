import { useState } from 'react';
import { Box, Modal, Title } from '@mantine/core';

import { useExtensionCategories } from '../../hooks/useExtensionCategories';

import { useSettingsViewStyles } from './Settings.styles';
import { SettingsCategoryRow } from '../../components/SettingsCategoryRow';

import { useExtensionSettings } from '../../hooks/useExtensionSettings';
import { CategoryForm } from '../../forms/CategoryForm';

export const Settings = () => {
	const { classes } = useSettingsViewStyles();

	const { categories, editCategory } = useExtensionCategories();

	const { extensionSettings } = useExtensionSettings();

	const [editCategoryModal, setEditCategoryModal] = useState({
		isVisible: false,
		categoryData: {
			id: '',
			categoryName: '',
			defaultCategory: false,
		},
	});

	return (
		<>
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
					<Title order={3} mb={8} sx={{ fontWeight: 600 }}>
						Categories
					</Title>

					<Box>
						{categories.map(({ title, id }) => (
							<SettingsCategoryRow
								name={title}
								key={id}
								onEditAction={() =>
									setEditCategoryModal((prevEditCategoryModal) => ({
										...prevEditCategoryModal,
										categoryData: {
											id: id,
											categoryName:
												categories?.find((category) => category.id === id)
													?.title || '',
											defaultCategory:
												id === extensionSettings?.defaultCategory,
										},
										isVisible: true,
									}))
								}
							/>
						))}
					</Box>
				</Box>

				<Box>
					<Title order={3} mb={8} sx={{ fontWeight: 600 }}>
						Bookmarks
					</Title>
				</Box>
			</Box>

			<Modal
				opened={editCategoryModal?.isVisible}
				onClose={() =>
					setEditCategoryModal((prevEditCategoryModal) => ({
						...prevEditCategoryModal,
						isVisible: false,
					}))
				}
				centered
				title="Edit category"
				size="lg"
			>
				<CategoryForm
					mode="edit"
					onClose={() =>
						setEditCategoryModal((prevEditCategoryModal) => ({
							...prevEditCategoryModal,
							isVisible: false,
						}))
					}
					initialValues={editCategoryModal?.categoryData}
					editCategory={editCategory}
				/>
			</Modal>
		</>
	);
};
