import { Button, Group, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';

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
	const bookmarkName = name ?? 'selected';
	const handleRemoveCategory = () => {
		handleAsyncAction(
			async () => {
				await wait(500);
				await removeBookmark({ id });

				showNotification({
					color: 'dark',
					message: `The ${bookmarkName} bookmark was successfully deleted!`,
					autoClose: 3000,
				});
			},
			{
				errorTitle: `Something went wrong when trying to remove the ${bookmarkName} bookmark!`,
				errorMessage: 'Sorry, but something went wrong, please try again.',
			},
		);

		onClose();
	};

	return (
		<Modal opened={opened} onClose={onClose} centered title="Remove bookmark" size="lg">
			<Text mb={16}>
				{'Are you sure you want to remove the '}
				<Text weight={600} inline sx={{ display: 'inline' }}>
					{bookmarkName}
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
