import { useState } from 'react';
import { Box, Group, Stack, Text } from '@mantine/core';
import { PlusIcon } from '@heroicons/react/solid';

import { useExtensionTheme } from '@hooks/useExtensionTheme';

import { ModalCustomTheme } from '@modals/ModalCustomTheme';
import { ModalRemoveCustomTheme } from '@modals/ModalRemoveCustomTheme';

import { CustomThemeBox } from '@components/CustomThemeBox';

import { useThemeSectionStyles } from './ThemeSection.styles';

export const ThemeSection = () => {
	const { classes, cx } = useThemeSectionStyles();
	const { theme, setTheme, customThemes, saveCustomTheme, editCustomTheme, removeCustomTheme } =
		useExtensionTheme({
			key: 'simpleStartTheme',
			defaultValue: 'light',
		});

	const [addThemeModal, setAddThemeModal] = useState<{
		isOpen: boolean;
		args: Record<string, any>;
	}>({
		isOpen: false,
		args: {
			data: null,
			mode: null,
		},
	});

	const [removeThemeModal, setRemoveThemeModal] = useState<{
		isOpen: boolean;
		args: Record<string, any>;
	}>({
		isOpen: false,
		args: {
			name: null,
		},
	});

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
							// todo: types for name and background
							const customThemeName = customThemeData.name
								.replace('created-theme-', '')
								.replace(/-/g, ' ');
							const customThemeBackground = customThemeData.colors.background[0];
							const customThemeBorder = customThemeData.colors.background[2];

							return (
								<CustomThemeBox
									onEdit={() =>
										setAddThemeModal((prevState) => ({
											...prevState,
											isOpen: true,
											args: {
												mode: 'edit',
												data: customThemeData,
											},
										}))
									}
									setActive={() => setTheme(customThemeData.name)}
									customThemeName={customThemeName}
									backgroundColor={customThemeBackground}
									borderColor={customThemeBorder}
									isActive={theme === customThemeData.name}
									onRemove={() =>
										setRemoveThemeModal((prevState) => ({
											...prevState,
											isOpen: true,
											args: {
												name: customThemeData.name,
											},
										}))
									}
								/>
							);
						})}

					<Stack
						align="center"
						sx={{ width: 80 }}
						onClick={() =>
							setAddThemeModal((prevState) => ({
								...prevState,
								isOpen: true,
								args: { mode: 'create' },
							}))
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
				opened={addThemeModal?.isOpen}
				onClose={() => setAddThemeModal((prevState) => ({ ...prevState, isOpen: false }))}
				title="Add new custom theme"
				saveCustomTheme={saveCustomTheme}
				mode={addThemeModal?.args.mode}
				initialValues={addThemeModal?.args?.data}
				editCustomTheme={editCustomTheme}
			/>

			<ModalRemoveCustomTheme
				isOpen={removeThemeModal.isOpen}
				onClose={() => setRemoveThemeModal({ isOpen: false, args: {} })}
				name={removeThemeModal.args?.name}
				removeTheme={() => removeCustomTheme(removeThemeModal?.args?.name)}
			/>
		</>
	);
};
