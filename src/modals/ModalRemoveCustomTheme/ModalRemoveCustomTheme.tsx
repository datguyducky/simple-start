import { Button, Group, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

type ModalRemoveCustomThemeProps = {
	isOpen: boolean;
	onClose: () => void;
	name: string;
	removeTheme: (name: string) => void;
};

export const ModalRemoveCustomTheme = ({
	name,
	isOpen,
	onClose,
	removeTheme,
}: ModalRemoveCustomThemeProps) => {
	const formattedName =
		name
			?.replace('created-theme-', '')
			.replace(/-/g, ' ')
			.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()) || '';

	const handleRemoveCategory = () => {
		setTimeout(async () => {
			try {
				await removeTheme(name);

				showNotification({
					color: 'dark',
					message: `The ${formattedName} theme was successfully deleted!`,
					autoClose: 3000,
				});
			} catch (error) {
				showNotification({
					color: 'red',
					title: `Something went wrong when trying to remove the ${formattedName} theme!`,
					message: 'Sorry, but something went wrong, please try again.',
					autoClose: 5000,
				});
			}
		}, 500);

		onClose();
	};

	return (
		<Modal opened={isOpen} onClose={onClose} centered title="Remove custom theme" size="lg">
			<Text mb={16}>
				{'Are you sure you want to remove the '}
				<Text weight={600} inline sx={{ display: 'inline' }}>
					{formattedName}
				</Text>
				{' theme?'}
			</Text>

			<Group position="right">
				<Button variant="outline" color="gray" onClick={onClose}>
					Cancel
				</Button>
				<Button color="red" onClick={handleRemoveCategory}>
					Remove
				</Button>
			</Group>
		</Modal>
	);
};
