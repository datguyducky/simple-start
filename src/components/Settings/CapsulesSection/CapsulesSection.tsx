import { Button, Text, Group, Modal, SimpleGrid, Box } from '@mantine/core';

import { constants } from '@common/constants';

import { useExtensionSettings } from '@hooks/useExtensionSettings';
import { useModal } from '@hooks/useModal';

import { showNotification } from '@mantine/notifications';
import { CapsulesSettingsForm } from '@forms/CapsulesSettingsForm';

export const CapsulesSection = () => {
	const { saveExtensionSettings } = useExtensionSettings();

	const resetCapsuleSettingsModal = useModal();

	const handleResetSettings = async () => {
		const defaultValues = Object.fromEntries(
			Object.entries(constants.defaultExtensionSettings).filter(([key]) =>
				key.includes('capsule'),
			),
		);

		setTimeout(async () => {
			try {
				await saveExtensionSettings(defaultValues);

				showNotification({
					color: 'dark',
					message: 'Capsule view settings have been reset to their default values!',
					autoClose: 3000,
				});
			} catch (error) {
				showNotification({
					color: 'red',
					title: 'Settings could not be reset!',
					message: 'Sorry, but something went wrong, please try again.',
					autoClose: 5000,
				});
			}
		}, 600);

		resetCapsuleSettingsModal.close(); // hide modal
	};

	return (
		<>
			<Box>
				<SimpleGrid cols={2} spacing={32} mb={8}>
					<Text weight={700}>Customize:</Text>
					<Text weight={700}>Preview:</Text>
				</SimpleGrid>

				<CapsulesSettingsForm openResetModal={resetCapsuleSettingsModal.open} />
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
