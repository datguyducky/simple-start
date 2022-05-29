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
		<Group position="apart" mb={8}>
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
					<ActionIcon color="red" onClick={onRemoveAction}>
						<TrashIcon style={{ width: 14, height: 14 }} />
					</ActionIcon>
				)}
				{onEditAction && (
					<ActionIcon color="dark" onClick={onEditAction}>
						<PencilAltIcon style={{ width: 14, height: 14 }} />
					</ActionIcon>
				)}
			</Group>
		</Group>
	);
};
