import { Button, Group, Modal, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';

type ModalRemoveCategoryProps = {
	id: string;
	opened: boolean;
	removeCategory: ({ id }: { id: string }) => Promise<void>;
	onClose: () => void;
	name?: string;
};

export const ModalRemoveCategory = ({
	id,
	name,
	opened,
	onClose,
	removeCategory,
}: ModalRemoveCategoryProps) => {
	const categoryName = name ?? 'selected';

	const handleRemoveCategory = () => {
		handleAsyncAction(
			async () => {
				await wait(500);
				await removeCategory({ id });

				notifications.show({
					color: 'dark',
					message: `The ${categoryName} category was successfully deleted!`,
					autoClose: 3000,
				});
			},
			{
				errorTitle: `Something went wrong when trying to remove the ${categoryName} category!`,
				errorMessage: 'Sorry, but something went wrong, please try again.',
			},
		);

		onClose();
	};

	return (
		<Modal opened={opened} onClose={onClose} centered title="Remove category" size="lg">
			<Text mb={16}>
				{'Are you sure you want to remove the '}
				<Text fw={600} inline component="span">
					{categoryName}
				</Text>
				{' category?'}

				<Text size="xs" c="gray">
					Remember that all bookmarks belonging to this category will also be deleted.
				</Text>
			</Text>

			<Group justify="flex-end">
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
