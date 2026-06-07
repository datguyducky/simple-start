import { type MouseEvent } from 'react';
import { ActionIcon, Box, Stack, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import clsx from 'clsx';

import classes from './CustomThemeBox.module.css';

type CustomThemeBoxProps = {
	setActive: () => void;
	onEdit: () => void;
	onRemove: () => void;
	customThemeName: string;
	backgroundColor: string;
	borderColor: string;
	isActive: boolean;
};

export const CustomThemeBox = ({
	onEdit,
	onRemove,
	setActive,
	customThemeName,
	backgroundColor,
	borderColor,
	isActive,
}: CustomThemeBoxProps) => {
	return (
		<Stack align="center" w={80} onClick={setActive}>
			<Box
				className={clsx(classes.customThemeBox, {
					[classes.active]: isActive,
				})}
				style={{
					'--settings-bg-color': backgroundColor,
					'--settings-border-color': borderColor,
				}}
			>
				<Stack className={classes.absoluteWrapper} gap={2}>
					<ActionIcon
						color="red"
						onClick={(event: MouseEvent<HTMLSpanElement>) => {
							event.stopPropagation();
							onRemove();
						}}
						component="span"
						size="xs"
						variant="filled"
						className={classes.removeAction}
					>
						<IconTrash size={14} />
					</ActionIcon>

					<ActionIcon
						onClick={(event: MouseEvent<HTMLSpanElement>) => {
							event.stopPropagation();
							onEdit();
						}}
						component="span"
						size="xs"
						variant="filled"
						color="blue"
						className={classes.editAction}
					>
						<IconEdit size={14} />
					</ActionIcon>
				</Stack>
			</Box>

			<Text
				size="sm"
				tt="capitalize"
				ta="center"
				style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}
			>
				{customThemeName}
			</Text>
		</Stack>
	);
};
