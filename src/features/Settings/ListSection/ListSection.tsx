import { useEffect, useState } from 'react';
import {
	Box,
	SimpleGrid,
	Button,
	Stack,
	NumberInput,
	Checkbox,
	ColorInput,
	Group,
	Text,
	Modal,
	Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMantineTheme } from '@mantine/core';

import { useExtensionSettings } from '../../../hooks/useExtensionSettings';
import { constants } from '../../../common/constants';
import { ListSettings } from '../../../types/settingsValues';
import { BookmarkListRow } from '../../../components/BookmarkListRow';

export const ListSection = () => {
	const theme = useMantineTheme();
	const { extensionSettings, saveExtensionSettings } = useExtensionSettings();

	const [resetModal, setResetModal] = useState(false);

	const { getInputProps, setValues, onSubmit, values, resetDirty, isDirty } =
		useForm<ListSettings>();

	useEffect(() => {
		if (extensionSettings) {
			const listSettings = Object.fromEntries(
				Object.entries(extensionSettings).filter(([key]) => key.includes('list')),
			) as ListSettings;

			setValues({
				...listSettings,
				listUrlColor:
					listSettings.listUrlColor === null
						? (theme.colors.text as unknown as string)
						: listSettings.listUrlColor,
				listNameColor:
					listSettings.listNameColor === null
						? (theme.colors.text as unknown as string)
						: listSettings.listNameColor,
			});
			resetDirty();
		}
	}, [extensionSettings]);

	const handleSaveExtensionSettings = async (formValues: typeof values) => {
		if (isDirty()) {
			await saveExtensionSettings(formValues as any); // todo: ANY-TYPE USAGE! Way to improve this?

			resetDirty();
		}
	};

	const handleResetSettings = async () => {
		const defaultValues = Object.fromEntries(
			Object.entries(constants.defaultExtensionSettings).filter(([key]) =>
				key.includes('list'),
			),
		);

		await saveExtensionSettings(defaultValues);

		setResetModal(false); // hide modal
		resetDirty();
	};

	return (
		<>
			<Box>
				<form onSubmit={onSubmit(handleSaveExtensionSettings)} noValidate>
					<Stack>
						<Box>
							<Text weight={700} mb={8}>
								Preview:
							</Text>

							<Stack justify="flex-start" spacing={values.listSpacing}>
								{constants.exampleBookmarks.map((bookmark) => (
									<BookmarkListRow
										key={bookmark.id}
										title={bookmark.name}
										url={bookmark.url}
										settings={values}
									/>
								))}
							</Stack>
						</Box>

						<Divider />

						<Box>
							<Text weight={700} mb={8}>
								Customize:
							</Text>

							<SimpleGrid cols={2} spacing={16} mb={24}>
								<Stack spacing={12} align="flex-start">
									<Group>
										<NumberInput
											label="Vertical padding for each bookmark"
											{...getInputProps('listVerticalPadding')}
										/>

										<NumberInput
											label="Horizontal padding for each bookmark"
											{...getInputProps('listHorizontalPadding')}
										/>
									</Group>

									<NumberInput
										label="Spacing between bookmarks"
										{...getInputProps('listSpacing')}
									/>

									<Group>
										<NumberInput
											label="Bookmark name size"
											{...getInputProps('listNameSize')}
										/>

										<NumberInput
											label="Bookmark url size"
											{...getInputProps('listUrlSize')}
										/>

										<NumberInput
											label="Icon size"
											{...getInputProps('listIconSize')}
										/>
									</Group>
								</Stack>

								<Stack spacing={12} align="flex-start">
									<Group align="flex-start">
										<ColorInput
											{...getInputProps('listNameColor')}
											format="hex"
											label="Color for bookmark name"
										/>

										<ColorInput
											{...getInputProps('listUrlColor')}
											format="hex"
											label="Color for bookmark url"
										/>
									</Group>

									<Group align="flex-start">
										<Stack spacing={12} align="flex-start">
											<Checkbox
												label="Use bold text for bookmark name"
												{...getInputProps('listNameBold', {
													type: 'checkbox',
												})}
											/>

											<Checkbox
												label="Use bold text for bookmark url"
												{...getInputProps('listUrlBold', {
													type: 'checkbox',
												})}
											/>

											<Checkbox
												label="Use italic text for bookmark name"
												{...getInputProps('listNameItalic', {
													type: 'checkbox',
												})}
											/>

											<Checkbox
												label="Use italic text for bookmark url"
												{...getInputProps('listUrlItalic', {
													type: 'checkbox',
												})}
											/>
										</Stack>

										<Stack spacing={12} align="flex-start">
											<Checkbox
												label="Hide bookmarks name"
												{...getInputProps('listHiddenName', {
													type: 'checkbox',
												})}
											/>
											<Checkbox
												label="Hide bookmarks url"
												{...getInputProps('listHiddenUrl', {
													type: 'checkbox',
												})}
											/>
										</Stack>
									</Group>
								</Stack>
							</SimpleGrid>
						</Box>
					</Stack>

					<Group position="center" sx={{ width: '100%', marginLeft: '-28px' }} mt={0}>
						<Button variant="outline" onClick={() => setResetModal(true)}>
							Reset to default
						</Button>
						<Button type="submit">Save</Button>
					</Group>
				</form>
			</Box>

			<Modal
				opened={resetModal}
				onClose={() => setResetModal(false)}
				centered
				title="Reset settings for list view to default ones?"
				size="lg"
			>
				<Text mb={16}>
					Are you sure you want to reset settings for the list view? This action can't be
					undone and all your custom settings will be replaced by the default values!
				</Text>

				<Group position="right">
					<Button variant="outline" color="dark" onClick={() => setResetModal(false)}>
						Cancel
					</Button>
					<Button color="primary" onClick={handleResetSettings}>
						Reset
					</Button>
				</Group>
			</Modal>
		</>
	);
};