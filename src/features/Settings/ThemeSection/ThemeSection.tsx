import { useState } from 'react';
import { Box, Group, Stack, Text } from '@mantine/core';
import { PlusIcon } from '@heroicons/react/solid';

import { useThemeSectionStyles } from './ThemeSection.styles';

import { useExtensionTheme } from '../../../hooks/useExtensionTheme';
import { ModalAddTheme } from '../../../modals/ModalAddTheme';

export const ThemeSection = () => {
	const { classes, cx } = useThemeSectionStyles();
	const { theme, setTheme } = useExtensionTheme({
		key: 'simpleStartTheme',
		defaultValue: 'light',
	});

	const [addThemeModal, setAddThemeModal] = useState(false);

	return (
		<>
			<Box mb={32}>
				<Group spacing={16} sx={{ alignItems: 'flex-start' }}>
					<Stack align="center" sx={{ width: 80 }} onClick={() => setTheme('light')}>
						<Box
							className={cx(classes.colorBox, classes.light, {
								[classes.active]: theme === 'light',
							})}
						/>

						<Text size="sm">Light Theme</Text>
					</Stack>

					<Stack align="center" sx={{ width: 80 }} onClick={() => setTheme('dark')}>
						<Box
							className={cx(classes.colorBox, classes.dark, {
								[classes.active]: theme === 'dark',
							})}
						/>

						<Text size="sm">Dark Theme</Text>
					</Stack>

					<Stack align="center" sx={{ width: 80 }} onClick={() => setAddThemeModal(true)}>
						<Box className={cx(classes.colorBox, classes.customAdd)}>
							<PlusIcon style={{ width: 32, height: 32 }} />
						</Box>

						<Text size="sm">Add Theme</Text>
					</Stack>
				</Group>
			</Box>

			<ModalAddTheme
				opened={addThemeModal}
				onClose={() => setAddThemeModal(false)}
				title="Add new custom theme"
			/>
		</>
	);
};
