import { Button, Group, Text, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { defaultGeneralSettings } from '@/common/constants';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { useModal } from '@/hooks/useModal';
import { GeneralSettingsForm } from '@/forms/GeneralSettingsForm';
import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';

export const GeneralSection = () => {
	const { saveExtensionSettings } = useExtensionSettings();
	const resetGeneralSettingsModal = useModal();

	const handleResetSettings = () => {
		resetGeneralSettingsModal.close();

		handleAsyncAction(
			async () => {
				await wait(600);
				await saveExtensionSettings(defaultGeneralSettings);

				notifications.show({
					color: 'dark',
					message: 'General settings have been reset to their default values!',
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
			<GeneralSettingsForm openResetModal={resetGeneralSettingsModal.open} />

			<Modal
				opened={resetGeneralSettingsModal.isOpen}
				onClose={resetGeneralSettingsModal.close}
				centered
				title="Reset general settings to default ones?"
				size="lg"
			>
				<Text mb={16}>
					Are you sure you want to reset general settings? This action cannot be
					undone and all your custom settings will be replaced by the default values!
				</Text>

				<Group justify="flex-end">
					<Button
						variant="outline"
						color="gray"
						onClick={() => {
							resetGeneralSettingsModal.close();
						}}
					>
						Cancel
					</Button>
					<Button onClick={handleResetSettings}>Reset</Button>
				</Group>
			</Modal>
		</>
	);
};
