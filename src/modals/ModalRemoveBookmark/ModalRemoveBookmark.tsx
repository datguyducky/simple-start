import { Button, Group, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

type ModalRemoveBookmarkProps = {
	id: string;
	opened: boolean;
	onClose: () => void;
	removeBookmark: ({ id }: { id: string }) => Promise<void>;
	name?: string;
};

export const ModalRemoveBookmark = ({
	id,
	name,
	opened,
	removeBookmark,
	onClose,
}: ModalRemoveBookmarkProps) => {
	const handleRemoveCategory = () => {
		setTimeout(async () => {
			try {
				await removeBookmark({ id: id });

				showNotification({
					color: 'dark',
					message: `The ${name} bookmark was successfully deleted!`,
					autoClose: 3000,
				});
			} catch (error) {
				showNotification({
					color: 'red',
					title: `Something went wrong when trying to remove the ${name} bookmark!`,
					message: 'Sorry, but something went wrong, please try again.',
					autoClose: 5000,
				});
			}
		}, 500);

		onClose();
	};

	return (
		<Modal opened={opened} onClose={onClose} centered title="Remove bookmark" size="lg">
			<Text mb={16}>
				{'Are you sure you want to remove the '}
				<Text weight={600} inline sx={{ display: 'inline' }}>
					{name}
				</Text>
				{' bookmark?'}

				<Text size="xs" color="gray">
					Remember that this action cannot be undone!
				</Text>
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
