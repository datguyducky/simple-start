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
import { useForm, schemaResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { type ListSettings } from '@/types/settingsValues';

import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';

import { constants } from '@/common/constants';
import { BookmarkListRow } from '@/components/BookmarkListRow';
import { listSettingsSchema } from '@/validation/ListSettingsSchema';

type ListSettingsFormProps = {
	openResetModal: () => void;
};

export const ListSettingsForm = ({ openResetModal }: ListSettingsFormProps) => {
	const { extensionSettings, saveExtensionSettings, hasListSettingsChanged } =
		useExtensionSettings();

	const form = useForm<ListSettings>({
		validate: schemaResolver(listSettingsSchema),
		validateInputOnChange: true,
	});

	useEffect(() => {
		if (Object.keys(extensionSettings).length) {
			const listSettings = Object.fromEntries(
				Object.entries(extensionSettings).filter(([key]) => key.includes('list')),
			) as ListSettings;

			const values = {
				...listSettings,
				listUrlColor: listSettings.listUrlColor === null ? '' : listSettings.listUrlColor,
				listNameColor:
					listSettings.listNameColor === null ? '' : listSettings.listNameColor,
			};

			form.setValues(values);
			form.resetDirty(values);
		}
	}, [extensionSettings]);

	const handleSaveExtensionSettings = (formValues: ListSettings) => {
		if (!form.isDirty()) {
			return;
		}

		handleAsyncAction(
			async () => {
				await wait(600);
				await saveExtensionSettings(formValues);

				notifications.show({
					color: 'dark',
					message: 'Settings for list view were successfully saved!',
					autoClose: 3000,
				});
			},
			{
				errorTitle: 'Settings could not be saved!',
			},
		);

		form.resetDirty();
	};

	return (
		<Stack>
			<Box>
				<Text fw={700} mb={8}>
					Preview:
				</Text>

				<Stack
					justify="flex-start"
					gap={form.values.listSpacing}
					style={{ overflow: 'hidden' }}
				>
					{constants.exampleBookmarks.map((bookmark, index) => (
						<BookmarkListRow
							key={bookmark.id}
							title={bookmark.name}
							url={bookmark.url}
							settings={form.values}
							isOdd={index % 2 === 0}
						/>
					))}
				</Stack>
			</Box>

			<Divider />

			<Box component="form" onSubmit={form.onSubmit(handleSaveExtensionSettings)} noValidate>
				<Text fw={700} mb={8}>
					Customize:
				</Text>

				<SimpleGrid cols={2} spacing={16} mb={24}>
					<Stack gap={12} align="flex-start">
						<Checkbox
							label="Use striped rows"
							{...form.getInputProps('listUseStrippedRows', {
								type: 'checkbox',
							})}
						/>

						<Group align="flex-start">
							<NumberInput
								label="Vertical padding for each bookmark"
								{...form.getInputProps('listVerticalPadding')}
							/>

							<NumberInput
								label="Horizontal padding for each bookmark"
								{...form.getInputProps('listHorizontalPadding')}
							/>
						</Group>

						<NumberInput
							label="Spacing between bookmarks"
							{...form.getInputProps('listSpacing')}
						/>

						<Group align="flex-start">
							<NumberInput
								label="Bookmark name size"
								{...form.getInputProps('listNameSize')}
							/>

							<NumberInput
								label="Bookmark url size"
								{...form.getInputProps('listUrlSize')}
							/>

							<NumberInput
								label="Icon size"
								{...form.getInputProps('listIconSize')}
							/>
						</Group>
					</Stack>

					<Stack gap={12} align="flex-start">
						<Group align="flex-start">
							<ColorInput
								{...form.getInputProps('listNameColor')}
								format="hex"
								label="Color for bookmark name"
							/>

							<ColorInput
								{...form.getInputProps('listUrlColor')}
								format="hex"
								label="Color for bookmark url"
							/>
						</Group>

						<Group align="flex-start">
							<Stack gap={12} align="flex-start">
								<Checkbox
									label="Use bold text for bookmark name"
									{...form.getInputProps('listNameBold', {
										type: 'checkbox',
									})}
								/>

								<Checkbox
									label="Use bold text for bookmark url"
									{...form.getInputProps('listUrlBold', {
										type: 'checkbox',
									})}
								/>

								<Checkbox
									label="Use italic text for bookmark name"
									{...form.getInputProps('listNameItalic', {
										type: 'checkbox',
									})}
								/>

								<Checkbox
									label="Use italic text for bookmark url"
									{...form.getInputProps('listUrlItalic', {
										type: 'checkbox',
									})}
								/>
							</Stack>

							<Stack gap={12} align="flex-start">
								<Checkbox
									label="Hide bookmarks name"
									{...form.getInputProps('listHiddenName', {
										type: 'checkbox',
									})}
								/>
								<Checkbox
									label="Hide bookmarks url"
									{...form.getInputProps('listHiddenUrl', {
										type: 'checkbox',
									})}
								/>
							</Stack>
						</Group>
					</Stack>
				</SimpleGrid>

				<Group justify="center" w="100%" ml={-24} mt={0}>
					<Button
						variant="outline"
						onClick={openResetModal}
						disabled={!hasListSettingsChanged()}
					>
						Reset to default
					</Button>
					<Button type="submit" disabled={!form.isValid() || !form.isDirty()}>
						Save
					</Button>
				</Group>
			</Box>
		</Stack>
	);
};
