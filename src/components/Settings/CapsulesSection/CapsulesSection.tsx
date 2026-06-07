import { Button, Text, Group, Modal, SimpleGrid, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { defaultCapsuleSettings } from '@/common/constants';
import { CapsulesSettingsForm } from '@/forms/CapsulesSettingsForm';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { useModal } from '@/hooks/useModal';
import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';

export const CapsulesSection = () => {
	const { saveExtensionSettings } = useExtensionSettings();
	const resetCapsuleSettingsModal = useModal();

	const handleResetSettings = () => {
		resetCapsuleSettingsModal.close();

		handleAsyncAction(
			async () => {
				await wait(600);
				await saveExtensionSettings(defaultCapsuleSettings);

				notifications.show({
					color: 'dark',
					message: 'Capsule view settings have been reset to their default values!',
					autoClose: 3000,
				});
			},
			{
				errorTitle: 'Settings could not be reset!',
			},
		);
	};

	return (
		<>
			<Box>
				<SimpleGrid cols={2} spacing={32} mb={8}>
					<Text fw={700}>Customize:</Text>
					<Text fw={700}>Preview:</Text>
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
					Are you sure you want to reset settings for the capsule view? This action cannot
					be undone and all your custom settings will be replaced by the default values!
				</Text>

				<Group align="flex-end">
					<Button
						variant="outline"
						color="gray"
						onClick={() => {
							resetCapsuleSettingsModal.close();
						}}
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
