import { Dispatch, SetStateAction } from 'react';

import { Button, Group, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

type ModalRemoveCategoryProps = {
	id: string;
	opened: boolean;
	removeCategory: ({ id }: { id: string }) => Promise<void>;
	setRemoveCategoryModal: Dispatch<SetStateAction<{ isVisible: boolean; id: string }>>;
	name?: string;
};

export const ModalRemoveCategory = ({
	id,
	name,
	opened,
	setRemoveCategoryModal,
	removeCategory,
}: ModalRemoveCategoryProps) => {
	const handleRemoveCategory = () => {
		setTimeout(async () => {
			try {
				await removeCategory({ id: id });

				showNotification({
					color: 'dark',
					message: `The ${name} category was successfully deleted!`,
					autoClose: 3000,
				});
			} catch (error) {
				showNotification({
					color: 'red',
					title: `Something went wrong when trying to remove the ${name} category!`,
					message: 'Sorry, but something went wrong, please try again.',
					autoClose: 5000,
				});
			}
		}, 500);
		setRemoveCategoryModal({ isVisible: false, id: '' }); // hide modal
	};

	return (
		<Modal
			opened={opened}
			onClose={() => setRemoveCategoryModal({ isVisible: false, id: '' })}
			centered
			title="Remove category"
			size="lg"
		>
			<Text mb={16}>
				{'Are you sure you want to remove the '}
				<Text weight={600} inline sx={{ display: 'inline' }}>
					{name}
				</Text>
				{' category?'}

				<Text size="xs" color="gray">
					Remember that all bookmarks belonging to this category will also be deleted.
				</Text>
			</Text>

			<Group position="right">
				<Button
					variant="outline"
					color="dark"
					onClick={() => setRemoveCategoryModal({ isVisible: false, id: '' })}
				>
					Cancel
				</Button>
				<Button color="red" onClick={handleRemoveCategory}>
					Remove
				</Button>
			</Group>
		</Modal>
	);
};
