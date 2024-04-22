import { Box, Group, Stack, Text } from '@mantine/core';
import { PlusIcon } from '@heroicons/react/solid';

import { useExtensionTheme } from '@hooks/useExtensionTheme';

import { ModalCustomTheme } from '@modals/ModalCustomTheme';
import { ModalRemoveCustomTheme } from '@modals/ModalRemoveCustomTheme';
import { useModal } from '@hooks/useModal';
import { CustomTheme } from '@extensionTypes/customTheme';
import { CustomThemeBox } from '@components/CustomThemeBox';

import { useThemeSectionStyles } from './ThemeSection.styles';

export const ThemeSection = () => {
	const { classes, cx } = useThemeSectionStyles();
	const { theme, setTheme, customThemes, saveCustomTheme, editCustomTheme, removeCustomTheme } =
		useExtensionTheme({
			key: 'simpleStartTheme',
			defaultValue: 'light',
		});

	const customThemeModal = useModal();
	const removeCustomThemeModal = useModal();

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
						customThemes.map((customThemeData) => {
							const customThemeName = customThemeData.name
								.replace('created-theme-', '')
								.replace(/-/g, ' ');
							const customThemeBackground = customThemeData.colors.background[0];
							const customThemeBorder = customThemeData.colors.background[2];

							return (
								<CustomThemeBox
									onEdit={() =>
										customThemeModal.open({
											mode: 'edit',
											data: customThemeData,
										})
									}
									setActive={() => setTheme(customThemeData.name)}
									customThemeName={customThemeName}
									backgroundColor={customThemeBackground}
									borderColor={customThemeBorder}
									isActive={theme === customThemeData.name}
									onRemove={() =>
										removeCustomThemeModal.open({
											name: customThemeData.name,
										})
									}
								/>
							);
						})}

					<Stack
						align="center"
						sx={{ width: 80 }}
						onClick={() =>
							customThemeModal.open({
								mode: 'create',
							})
						}
					>
						<Box className={cx(classes.colorBox, classes.customAdd)}>
							<PlusIcon style={{ width: 32, height: 32 }} />
						</Box>

						<Text size="sm" align="center">
							Add Theme
						</Text>
					</Stack>
				</Group>
			</Box>

			<ModalCustomTheme
				opened={customThemeModal.isOpen}
				onClose={customThemeModal.close}
				title="Add new custom theme"
				saveCustomTheme={saveCustomTheme}
				mode={customThemeModal?.args?.mode as 'edit' | 'create'}
				initialValues={customThemeModal?.args?.data as CustomTheme}
				editCustomTheme={editCustomTheme}
			/>

			<ModalRemoveCustomTheme
				isOpen={removeCustomThemeModal.isOpen}
				onClose={removeCustomThemeModal.close}
				name={removeCustomThemeModal.args?.name as string}
				removeTheme={() => removeCustomTheme(removeCustomThemeModal?.args?.name as string)}
			/>
		</>
	);
};
