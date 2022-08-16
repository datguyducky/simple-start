import { Box, Group, Stack, Text } from '@mantine/core';

import { useThemeSectionStyles } from './ThemeSection.styles';
import { useExtensionTheme } from '../../../hooks/useExtensionTheme';

export const ThemeSection = () => {
	const { classes, cx } = useThemeSectionStyles();
	const [theme, setTheme] = useExtensionTheme({ key: 'simpleStartTheme', defaultValue: 'light' });

	return (
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
			</Group>
		</Box>
	);
};
