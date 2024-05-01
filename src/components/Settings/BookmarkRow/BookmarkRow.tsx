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
			position="apart"
			spacing={0}
			ref={ref}
			sx={(theme) => ({
				padding: '8px 16px',
				backgroundColor:
					hovered || isBeingMoved ? theme.colors.background[2] : 'transparent',
			})}
		>
			<Text
				sx={{
					maxWidth: '90%',
					textOverflow: 'ellipsis',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
				}}
			>
				{name}
			</Text>

			<Group spacing={8}>
				{onRemoveAction && (
					<ActionIcon color="red" onClick={onRemoveAction} component="span">
						<IconTrash size={14} />
					</ActionIcon>
				)}
				{onEditAction && (
					<ActionIcon
						onClick={onEditAction}
						component="span"
						sx={(theme) => ({
							color: theme.colors.text,
						})}
					>
						<IconEdit size={14} />
					</ActionIcon>
				)}
			</Group>
		</Group>
	);
};
