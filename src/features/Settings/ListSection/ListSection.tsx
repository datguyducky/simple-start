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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMantineTheme } from '@mantine/core';

import { useExtensionSettings } from '../../../hooks/useExtensionSettings';
import { constants } from '../../../common/constants';

export const ListSection = () => {
	const theme = useMantineTheme();
	const { extensionSettings, saveExtensionSettings } = useExtensionSettings();

	const [resetModal, setResetModal] = useState(false);

	const { getInputProps, setValues, onSubmit, values, resetDirty, isDirty, setFieldValue } =
		useForm({
			initialValues: {
				listHiddenName: false,
				listHiddenUrl: false,
				listNameItalic: false,
				listNameBold: false,
				listUrlItalic: false,
				listUrlBold: false,
				listUrlColor: (theme.colors.text as unknown as string) || '',
				listNameColor: (theme.colors.text as unknown as string) || '',
				listVerticalPadding: 12,
				listHorizontalPadding: 20,
				listSpacing: 4,
				listIconSize: 24,
				listNameSize: 16,
				listUrlSize: 14,
			}, // todo: any way to improve this?
		});

	useEffect(() => {
		if (extensionSettings) {
			const listSettings = Object.fromEntries(
				Object.entries(extensionSettings).filter(([key]) => key.includes('list')),
			);

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
			await saveExtensionSettings(formValues);

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
			<SimpleGrid cols={2} spacing={32} mb={32}>
				<Box>
					<form onSubmit={onSubmit(handleSaveExtensionSettings)} noValidate>
						<Stack spacing={32} justify="flex-start">
							<Box>
								<Checkbox
									label="Use bold text for bookmark name"
									checked={values.listNameBold}
									onChange={(event) =>
										setFieldValue('listNameBold', event.currentTarget.checked)
									}
								/>

								<Checkbox
									label="Use bold text for bookmark url"
									checked={values.listUrlBold}
									onChange={(event) =>
										setFieldValue('listUrlBold', event.currentTarget.checked)
									}
								/>

								<Checkbox
									label="Use italic text for bookmark name"
									checked={values.listNameItalic}
									onChange={(event) =>
										setFieldValue('listNameItalic', event.currentTarget.checked)
									}
								/>

								<Checkbox
									label="Use italic text for bookmark url"
									checked={values.listUrlItalic}
									onChange={(event) =>
										setFieldValue('listUrlItalic', event.currentTarget.checked)
									}
								/>

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

								<Checkbox
									label="Hide bookmarks name"
									checked={values.listHiddenName}
									onChange={(event) =>
										setFieldValue('listHiddenName', event.currentTarget.checked)
									}
								/>

								<Checkbox
									label="Hide bookmarks url"
									checked={values.listHiddenUrl}
									onChange={(event) =>
										setFieldValue('listHiddenUrl', event.currentTarget.checked)
									}
								/>

								<Group spacing={12}>
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

								<NumberInput label="Icon size" {...getInputProps('listIconSize')} />

								<NumberInput
									label="Bookmark name size"
									{...getInputProps('listNameSize')}
								/>

								<NumberInput
									label="Bookmark url size"
									{...getInputProps('listUrlSize')}
								/>
							</Box>

							<Group>
								<Button variant="outline" onClick={() => setResetModal(true)}>
									Reset to default
								</Button>
								<Button type="submit">Save</Button>
							</Group>
						</Stack>
					</form>
				</Box>
			</SimpleGrid>

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
