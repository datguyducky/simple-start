import { Button, Group, Text, Modal } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { defaultListSettings } from '@/common/constants';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { useModal } from '@/hooks/useModal';
import { ListSettingsForm } from '@/forms/ListSettingsForm';
import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';

export const ListSection = () => {
	const { saveExtensionSettings } = useExtensionSettings();
	const resetListSettingsModal = useModal();

	const handleResetSettings = () => {
		resetListSettingsModal.close();

		handleAsyncAction(
			async () => {
				await wait(600);
				await saveExtensionSettings(defaultListSettings);

				showNotification({
					color: 'dark',
					message: 'List view settings have been reset to their default values!',
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
			<ListSettingsForm openResetModal={resetListSettingsModal.open} />

			<Modal
				opened={resetListSettingsModal.isOpen}
				onClose={resetListSettingsModal.close}
				centered
				title="Reset settings for list view to default ones?"
				size="lg"
			>
				<Text mb={16}>
					Are you sure you want to reset settings for the list view? This action cannot be
					undone and all your custom settings will be replaced by the default values!
				</Text>

				<Group position="right">
					<Button
						variant="outline"
						color="gray"
						onClick={() => {
							resetListSettingsModal.close();
						}}
					>
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
