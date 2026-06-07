import { Button, Group, Modal, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';

type ModalRemoveCustomThemeProps = {
	isOpen: boolean;
	onClose: () => void;
	name?: string;
	removeTheme: (name: string) => Promise<void>;
};

export const ModalRemoveCustomTheme = ({
	name,
	isOpen,
	onClose,
	removeTheme,
}: ModalRemoveCustomThemeProps) => {
	const formattedName = name
		?.replace('created-theme-', '')
		.replace(/-/g, ' ')
		.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

	const handleRemoveTheme = () => {
		if (name === undefined || formattedName === undefined) {
			onClose();
			return;
		}

		handleAsyncAction(
			async () => {
				await wait(500);
				await removeTheme(name);

				notifications.show({
					color: 'dark',
					message: `The ${formattedName} theme was successfully deleted!`,
					autoClose: 3000,
				});
			},
			{
				errorTitle: `Something went wrong when trying to remove the ${formattedName} theme!`,
				errorMessage: 'Sorry, but something went wrong, please try again.',
			},
		);

		onClose();
	};

	return (
		<Modal opened={isOpen} onClose={onClose} centered title="Remove custom theme" size="lg">
			<Text mb={16}>
				{'Are you sure you want to remove the '}
				<Text fw={600} inline component="span">
					{formattedName}
				</Text>
				{' theme?'}
			</Text>

			<Group justify="flex-end">
				<Button variant="outline" color="gray" onClick={onClose}>
					Cancel
				</Button>
				<Button color="red" onClick={handleRemoveTheme}>
					Remove
				</Button>
			</Group>
		</Modal>
	);
};
