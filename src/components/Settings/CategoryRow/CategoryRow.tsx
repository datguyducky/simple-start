import { type MouseEvent } from 'react';
import { ActionIcon, Box, Group, Text } from '@mantine/core';
import { IconGripVertical, IconEdit, IconTrash } from '@tabler/icons-react';

type CategoryRowProps = {
	name: string;
	onRemoveAction?: () => void;
	onEditAction?: () => void;
	isBeingMoved?: boolean;
};

export const CategoryRow = ({
	name,
	onRemoveAction,
	onEditAction,
	...otherProps
}: CategoryRowProps) => {
	return (
		<Group justify="space-between" gap={0} {...otherProps}>
			<Group>
				<Box {...otherProps} mt={4}>
					<IconGripVertical size={16} />
				</Box>

				<Text
					maw="90%"
					style={{
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						whiteSpace: 'nowrap',
					}}
					lh="normal"
				>
					{name}
				</Text>
			</Group>

			<Group gap={8}>
				{onRemoveAction && (
					<ActionIcon
						color="red"
						onClick={(event: MouseEvent<HTMLSpanElement>) => {
							event.stopPropagation();
							onRemoveAction();
						}}
						component="span"
						variant="transparent"
					>
						<IconTrash size={16} />
					</ActionIcon>
				)}
				{onEditAction && (
					<ActionIcon
						onClick={(event: MouseEvent<HTMLSpanElement>) => {
							event.stopPropagation();
							onEditAction();
						}}
						component="span"
						c="var(--mantine-color-text)"
						variant="transparent"
					>
						<IconEdit size={16} />
					</ActionIcon>
				)}
			</Group>
		</Group>
	);
};
