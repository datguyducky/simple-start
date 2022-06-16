import { ActionIcon, Group, Text } from '@mantine/core';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';

type SettingsCategoryRowProps = {
	name: string;
	onRemoveAction?: () => void;
	onEditAction?: () => void;
};

export const SettingsCategoryRow = ({
	name,
	onRemoveAction,
	onEditAction,
}: SettingsCategoryRowProps) => {
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
					<ActionIcon<'span'>
						color="red"
						onClick={(event) => {
							event.stopPropagation();
							onRemoveAction();
						}}
						component="span"
					>
						<TrashIcon style={{ width: 14, height: 14 }} />
					</ActionIcon>
				)}
				{onEditAction && (
					<ActionIcon<'span'>
						color="dark"
						onClick={(event) => {
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
