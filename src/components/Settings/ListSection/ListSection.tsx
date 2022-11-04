import { Button, Group, Text, Modal } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { constants } from '@common/constants';

import { useExtensionSettings } from '@hooks/useExtensionSettings';
import { useModal } from '@hooks/useModal';

import { ListSettingsForm } from '@forms/ListSettingsForm';

export const ListSection = () => {
	const { saveExtensionSettings } = useExtensionSettings();

	const resetListSettingsModal = useModal();

	const handleResetSettings = async () => {
		const defaultValues = Object.fromEntries(
			Object.entries(constants.defaultExtensionSettings).filter(([key]) =>
				key.includes('list'),
			),
		);

		setTimeout(async () => {
			try {
				await saveExtensionSettings(defaultValues);

				showNotification({
					color: 'dark',
					message: 'List view settings have been reset to their default values!',
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

		resetListSettingsModal.close(); // hide modal
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
					Are you sure you want to reset settings for the list view? This action can't be
					undone and all your custom settings will be replaced by the default values!
				</Text>

				<Group position="right">
					<Button
						variant="outline"
						color="gray"
						onClick={() => resetListSettingsModal.close()}
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
