import { ActionIcon, Group, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useHover } from '@mantine/hooks';

type BookmarkRowProps = {
	name: string;
	onRemoveAction?: () => void;
	onEditAction?: () => void;
	isBeingMoved?: boolean;
};

export const BookmarkRow = ({
	name,
	onRemoveAction,
	onEditAction,
	isBeingMoved,
}: BookmarkRowProps) => {
	const { hovered, ref } = useHover();

	return (
		<Group
			justify="space-between"
			gap={0}
			ref={ref}
			style={{
				padding: '8px 16px',
				backgroundColor:
					hovered || isBeingMoved ? 'var(--mantine-color-background-2)' : 'transparent',
			}}
		>
			<Text
				style={{
					maxWidth: '90%',
					textOverflow: 'ellipsis',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
				}}
			>
				{name}
			</Text>

			<Group gap={8}>
				{onRemoveAction && (
					<ActionIcon
						color="red"
						onClick={onRemoveAction}
						component="span"
						variant="transparent"
					>
						<IconTrash size={14} />
					</ActionIcon>
				)}
				{onEditAction && (
					<ActionIcon
						onClick={onEditAction}
						component="span"
						c="var(--mantine-color-text)"
						variant="transparent"
					>
						<IconEdit size={14} />
					</ActionIcon>
				)}
			</Group>
		</Group>
	);
};
