import { ActionIcon, Group, Text } from '@mantine/core';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
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
						<TrashIcon style={{ width: 14, height: 14 }} />
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
						<PencilAltIcon style={{ width: 14, height: 14 }} />
					</ActionIcon>
				)}
			</Group>
		</Group>
	);
};
