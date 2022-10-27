import { useEffect, useState } from 'react';
import {
	Box,
	SimpleGrid,
	Button,
	Stack,
	NumberInput,
	Checkbox,
	ColorInput,
	Text,
	Group,
	Modal,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMantineTheme } from '@mantine/core';

import { useExtensionSettings } from '../../../hooks/useExtensionSettings';
import { constants } from '../../../common/constants';

export const CapsulesSection = () => {
	const theme = useMantineTheme();
	const { extensionSettings, saveExtensionSettings } = useExtensionSettings();

	const [resetModal, setResetModal] = useState(false);

	const { getInputProps, setValues, onSubmit, values, resetDirty, isDirty, setFieldValue } =
		useForm({
			initialValues: {
				capsuleSpacing: 24,
				capsuleSize: 110,
				capsuleIconSize: 32,
				capsuleLabelSize: 14,
				capsuleLabelItalic: false,
				capsuleLabelBold: false,
				capsuleLabelColor: (theme.colors.text as unknown as string) || '',
				capsuleHiddenName: false,
			}, // todo: any way to improve this?
		});

	useEffect(() => {
		if (extensionSettings) {
			const capsuleSettings = Object.fromEntries(
				Object.entries(extensionSettings).filter(([key]) => key.includes('capsule')),
			);

			setValues({
				...capsuleSettings,
				capsuleLabelColor:
					capsuleSettings.capsuleLabelColor === null
						? (theme.colors.text as unknown as string)
						: capsuleSettings.capsuleLabelColor,
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
				key.includes('capsule'),
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
								{/*
							<Text size={14}>Capsules number per row</Text>
							<Slider
								marks={MARKS}
								min={1}
								max={32}
								{...getInputProps('capsuleColumns')}
							/>*/}

								<NumberInput
									label="Capsule size"
									{...getInputProps('capsuleSize')}
								/>

								<NumberInput
									label="Space between capsules"
									{...getInputProps('capsuleSpacing')}
								/>

								<NumberInput
									label="Favicon size"
									{...getInputProps('capsuleIconSize')}
								/>

								<NumberInput
									label="Labels size"
									{...getInputProps('capsuleLabelSize')}
								/>

								<Checkbox
									label="Use bold text for labels"
									checked={values.capsuleLabelBold}
									onChange={(event) =>
										setFieldValue(
											'capsuleLabelBold',
											event.currentTarget.checked,
										)
									}
								/>

								<Checkbox
									label="Use italic text for labels"
									checked={values.capsuleLabelItalic}
									onChange={(event) =>
										setFieldValue(
											'capsuleLabelItalic',
											event.currentTarget.checked,
										)
									}
								/>

								<ColorInput
									{...getInputProps('capsuleLabelColor')}
									format="hex"
									label="Label color"
								/>

								<Checkbox
									label="Hide labels for bookmarks"
									checked={values.capsuleHiddenName}
									onChange={(event) =>
										setFieldValue(
											'capsuleHiddenName',
											event.currentTarget.checked,
										)
									}
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
				title="Reset settings for capsule view to default ones?"
				size="lg"
			>
				<Text mb={16}>
					Are you sure you want to reset settings for the capsule view? This action can't
					be undone and all your custom settings will be replaced by the default values!
				</Text>

				<Group position="right">
					<Button variant="outline" color="dark" onClick={() => setResetModal(false)}>
						Cancel
					</Button>
					<Button color="primaryColor" onClick={handleResetSettings}>
						Reset
					</Button>
				</Group>
			</Modal>
		</>
	);
};
