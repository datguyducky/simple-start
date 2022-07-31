import React from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';

type CategoryRowProps = {
	name: string;
	onRemoveAction?: () => void;
	onEditAction?: () => void;
};

export const CategoryRow = ({ name, onRemoveAction, onEditAction }: CategoryRowProps) => {
	return (
		<Group position="apart" spacing={0}>
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
						color="dark"
						onClick={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
							event.stopPropagation();
							onEditAction();
						}}
						component="span"
					>
						<PencilAltIcon style={{ width: 14, height: 14 }} />
					</ActionIcon>
				)}
			</Group>
		</Group>
	);
};
