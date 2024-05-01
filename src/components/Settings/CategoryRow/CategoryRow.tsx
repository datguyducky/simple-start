import React from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import { IconGripVertical } from '@tabler/icons-react';

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
		<Group position="apart" spacing={0} {...otherProps}>
			<Group>
				<div {...otherProps}>
					<IconGripVertical size={14} />
				</div>

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
			</Group>

			<Group spacing={8}>
				{onRemoveAction && (
					<ActionIcon
						color="red"
						onClick={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
							event.stopPropagation();
							onRemoveAction();
						}}
						component="span"
					>
						<TrashIcon style={{ width: 14, height: 14 }} />
					</ActionIcon>
				)}
				{onEditAction && (
					<ActionIcon
						onClick={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
							event.stopPropagation();
							onEditAction();
						}}
						component="span"
						sx={(theme) => ({ color: theme.colors.text })}
					>
						<PencilAltIcon style={{ width: 14, height: 14 }} />
					</ActionIcon>
				)}
			</Group>
		</Group>
	);
};
