import React from 'react';
import { ActionIcon, Box, Stack, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

import { useCustomThemeBoxStyles } from './CustomThemeBox.styles';

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
	const { classes, cx } = useCustomThemeBoxStyles({ backgroundColor, borderColor });

	return (
		<Stack align="center" sx={{ width: 80 }} onClick={setActive}>
			<Box
				className={cx(classes.customThemeBox, {
					[classes.active]: isActive,
				})}
			>
				<Stack className={classes.absoluteWrapper} spacing={2}>
					<ActionIcon
						color="red"
						onClick={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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
						onClick={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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
				transform="capitalize"
				align="center"
				sx={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}
			>
				{customThemeName}
			</Text>
		</Stack>
	);
};
