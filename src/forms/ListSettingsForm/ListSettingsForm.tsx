import { useEffect } from 'react';
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
	Divider,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';

import { ListSettings } from '@extensionTypes/settingsValues';

import { useExtensionSettings } from '@hooks/useExtensionSettings';

import { showNotification } from '@mantine/notifications';
import { constants } from '@common/constants';
import { BookmarkListRow } from '@components/BookmarkListRow';
import { listSettingsSchema } from '@validation/ListSettingsSchema';

type ListSettingsFormProps = {
	openResetModal: () => void;
};

export const ListSettingsForm = ({ openResetModal }: ListSettingsFormProps) => {
	const { extensionSettings, saveExtensionSettings } = useExtensionSettings();

	const { errors, getInputProps, setValues, onSubmit, values, resetDirty, isDirty, isValid } =
		useForm<ListSettings>({
			validate: zodResolver(listSettingsSchema),
			validateInputOnChange: true,
		});

	useEffect(() => {
		if (extensionSettings) {
			const listSettings = Object.fromEntries(
				Object.entries(extensionSettings).filter(([key]) => key.includes('list')),
			) as ListSettings;

			setValues({
				...listSettings,
				listUrlColor: listSettings.listUrlColor === null ? '' : listSettings.listUrlColor,
				listNameColor:
					listSettings.listNameColor === null ? '' : listSettings.listNameColor,
			});
			resetDirty();
		}
	}, [extensionSettings]);

	const handleSaveExtensionSettings = async (formValues: typeof values) => {
		if (isDirty()) {
			setTimeout(async () => {
				try {
					await saveExtensionSettings(formValues);

					showNotification({
						color: 'dark',
						message: 'Settings for list view were successfully saved!',
						autoClose: 3000,
					});
				} catch (error) {
					showNotification({
						color: 'red',
						title: 'Settings could not be saved!',
						message: 'Sorry, but something went wrong, please try again.',
						autoClose: 5000,
					});
				}
			}, 600);

			resetDirty();
		}
	};

	console.log(errors, '?');
	return (
		<Stack>
			<Box>
				<Text weight={700} mb={8}>
					Preview:
				</Text>

				<Stack
					justify="flex-start"
					spacing={values.listSpacing}
					sx={{ overflow: 'hidden' }}
				>
					{constants.exampleBookmarks.map((bookmark, index) => (
						<BookmarkListRow
							key={bookmark.id}
							title={bookmark.name}
							url={bookmark.url}
							settings={values}
							isOdd={index % 2 === 0}
						/>
					))}
				</Stack>
			</Box>

			<Divider />

			<Box component="form" onSubmit={onSubmit(handleSaveExtensionSettings)} noValidate>
				<Text weight={700} mb={8}>
					Customize:
				</Text>

				<SimpleGrid cols={2} spacing={16} mb={24}>
					<Stack spacing={12} align="flex-start">
						<Checkbox
							label="Use striped rows"
							{...getInputProps('listUseStrippedRows', {
								type: 'checkbox',
							})}
						/>

						<Group align="flex-start">
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

						<Group align="flex-start">
							<NumberInput
								label="Bookmark name size"
								{...getInputProps('listNameSize')}
							/>

							<NumberInput
								label="Bookmark url size"
								{...getInputProps('listUrlSize')}
							/>

							<NumberInput label="Icon size" {...getInputProps('listIconSize')} />
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

				<Group position="center" sx={{ width: '100%', marginLeft: '-28px' }} mt={0}>
					<Button variant="outline" onClick={openResetModal}>
						Reset to default
					</Button>
					<Button type="submit" disabled={!isValid()}>
						Save
					</Button>
				</Group>
			</Box>
		</Stack>
	);
};
