import { useEffect } from 'react';
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

import { constants } from '@common/constants';
import { CapsuleSettings } from '@extensionTypes/settingsValues';

import { useExtensionSettings } from '@hooks/useExtensionSettings';
import { useModal } from '@hooks/useModal';

import { BookmarkCapsule } from '@components/BookmarkCapsule';

export const CapsulesSection = () => {
	const { extensionSettings, saveExtensionSettings } = useExtensionSettings();

	const resetCapsuleSettingsModal = useModal();

	const { getInputProps, setValues, onSubmit, values, resetDirty, isDirty } =
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
						? ''
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

		resetCapsuleSettingsModal.close(); // hide modal
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
								{...getInputProps('capsuleLabelBold', {
									type: 'checkbox',
								})}
							/>

							<Checkbox
								label="Use italic text for labels"
								{...getInputProps('capsuleLabelItalic', {
									type: 'checkbox',
								})}
							/>

							<Checkbox
								label="Hide labels for bookmarks"
								{...getInputProps('capsuleHiddenName', {
									type: 'checkbox',
								})}
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
						<Button variant="outline" onClick={() => resetCapsuleSettingsModal.open()}>
							Reset to default
						</Button>
						<Button type="submit">Save</Button>
					</Group>
				</form>
			</Box>

			<Modal
				opened={resetCapsuleSettingsModal.isOpen}
				onClose={resetCapsuleSettingsModal.close}
				centered
				title="Reset settings for capsule view to default ones?"
				size="lg"
			>
				<Text mb={16}>
					Are you sure you want to reset settings for the capsule view? This action can't
					be undone and all your custom settings will be replaced by the default values!
				</Text>

				<Group position="right">
					<Button
						variant="outline"
						color="gray"
						onClick={() => resetCapsuleSettingsModal.close()}
					>
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
