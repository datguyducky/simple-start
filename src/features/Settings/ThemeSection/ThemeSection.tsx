import { useState } from 'react';
import { Box, Group, Stack, Text } from '@mantine/core';
import { PlusIcon } from '@heroicons/react/solid';

import { useThemeSectionStyles } from './ThemeSection.styles';

import { useExtensionTheme } from '../../../hooks/useExtensionTheme';
import { ModalAddTheme } from '../../../modals/ModalAddTheme';

export const ThemeSection = () => {
	const { classes, cx } = useThemeSectionStyles();
	const { theme, setTheme, customThemes, saveCustomTheme } = useExtensionTheme({
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

						<Text size="sm" align="center">
							Light Theme
						</Text>
					</Stack>

					<Stack align="center" sx={{ width: 80 }} onClick={() => setTheme('dark')}>
						<Box
							className={cx(classes.colorBox, classes.dark, {
								[classes.active]: theme === 'dark',
							})}
						/>

						<Text size="sm" align="center">
							Dark Theme
						</Text>
					</Stack>

					{customThemes &&
						customThemes.map(({ name, colors }) => {
							// todo: types for name and background
							const customThemeName = name
								.replace('created-theme-', '')
								.replace(/-/g, ' ');
							const customThemeBackground = colors.background[0]; // todo: fix typing
							const customThemeBorder = colors.background[2]; // todo: fix typing

							return (
								<Stack
									align="center"
									sx={{ width: 80 }}
									onClick={() => setTheme(name)}
								>
									<Box
										className={cx(classes.colorBox, {
											[classes.active]: theme === name,
										})}
										sx={{
											backgroundColor: customThemeBackground,
											borderColor: customThemeBorder,

											'&:hover': {
												backgroundColor: customThemeBorder,
											},
										}}
									/>

									<Text size="sm" transform="capitalize" align="center">
										{customThemeName}
									</Text>
								</Stack>
							);
						})}

					<Stack align="center" sx={{ width: 80 }} onClick={() => setAddThemeModal(true)}>
						<Box className={cx(classes.colorBox, classes.customAdd)}>
							<PlusIcon style={{ width: 32, height: 32 }} />
						</Box>

						<Text size="sm" align="center">
							Add Theme
						</Text>
					</Stack>
				</Group>
			</Box>

			<ModalAddTheme
				opened={addThemeModal}
				onClose={() => setAddThemeModal(false)}
				title="Add new custom theme"
				saveCustomTheme={saveCustomTheme}
			/>
		</>
	);
};
