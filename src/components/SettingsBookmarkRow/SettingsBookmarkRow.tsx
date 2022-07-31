import { ActionIcon, Group, Text } from '@mantine/core';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';

type SettingsBookmarkRowProps = {
	name: string;
	onRemoveAction?: () => void;
	onEditAction?: () => void;
};

export const SettingsBookmarkRow = ({
	name,
	onRemoveAction,
	onEditAction,
}: SettingsBookmarkRowProps) => {
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
					<ActionIcon color="red" onClick={onRemoveAction} component="span">
						<TrashIcon style={{ width: 14, height: 14 }} />
					</ActionIcon>
				)}
				{onEditAction && (
					<ActionIcon color="dark" onClick={onEditAction} component="span">
						<PencilAltIcon style={{ width: 14, height: 14 }} />
					</ActionIcon>
				)}
			</Group>
		</Group>
	);
};
