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
	Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMantineTheme } from '@mantine/core';

import { useExtensionSettings } from '../../../hooks/useExtensionSettings';
import { constants } from '../../../common/constants';
import { BookmarkCapsule } from '../../../components/BookmarkCapsule';
import { CapsuleSettings } from '../../../types/settingsValues';

export const CapsulesSection = () => {
	const theme = useMantineTheme();
	const { extensionSettings, saveExtensionSettings } = useExtensionSettings();

	const [resetModal, setResetModal] = useState(false);

	const { getInputProps, setValues, onSubmit, values, resetDirty, isDirty, setFieldValue } =
		useForm<CapsuleSettings>();

	useEffect(() => {
		if (extensionSettings) {
			const capsuleSettings = Object.fromEntries(
				Object.entries(extensionSettings).filter(([key]) => key.includes('capsule')),
			) as CapsuleSettings;

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
			await saveExtensionSettings(formValues as any); // todo: ANY-TYPE USAGE! Way to improve this?

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
			<Box mb={32}>
				<form onSubmit={onSubmit(handleSaveExtensionSettings)} noValidate>
					<SimpleGrid cols={2} spacing={32} mb={8}>
						<Text weight={700}>Customize:</Text>
						<Text weight={700}>Preview:</Text>
					</SimpleGrid>

					<SimpleGrid cols={2} spacing={16} mb={24}>
						<Stack spacing={12} align="flex-start">
							<NumberInput label="Capsule size" {...getInputProps('capsuleSize')} />

							<NumberInput
								label="Space between capsules"
								{...getInputProps('capsuleSpacing')}
							/>

							<NumberInput
								label="Favicon size"
								{...getInputProps('capsuleIconSize')}
							/>

							<Group>
								<NumberInput
									label="Labels size"
									{...getInputProps('capsuleLabelSize')}
								/>

								<ColorInput
									{...getInputProps('capsuleLabelColor')}
									format="hex"
									label="Label color"
								/>
							</Group>

							<Checkbox
								label="Use bold text for labels"
								checked={values.capsuleLabelBold}
								onChange={(event) =>
									setFieldValue('capsuleLabelBold', event.currentTarget.checked)
								}
							/>

							<Checkbox
								label="Use italic text for labels"
								checked={values.capsuleLabelItalic}
								onChange={(event) =>
									setFieldValue('capsuleLabelItalic', event.currentTarget.checked)
								}
							/>

							<Checkbox
								label="Hide labels for bookmarks"
								checked={values.capsuleHiddenName}
								onChange={(event) =>
									setFieldValue('capsuleHiddenName', event.currentTarget.checked)
								}
							/>
						</Stack>

						<Group spacing={0}>
							<Divider orientation="vertical" mr={16} />

							<Group spacing={values.capsuleSpacing} mx="auto">
								{constants.exampleBookmarks.map((bookmark) => (
									<BookmarkCapsule
										key={bookmark.id}
										title={bookmark.name}
										url={bookmark?.url}
										settings={values}
									/>
								))}
							</Group>
						</Group>
					</SimpleGrid>

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
