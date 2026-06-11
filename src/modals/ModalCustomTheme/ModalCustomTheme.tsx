import { useEffect, useMemo, useRef, useState } from 'react';
import {
	ColorInput,
	Collapse,
	Modal,
	Stepper,
	SimpleGrid,
	Group,
	Button,
	UnstyledButton,
	Text,
	Divider,
	Box,
	Stack,
	TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { generateColors } from '@mantine/colors-generator';

import {
	type CustomTheme,
	type CustomThemeColors,
	type CustomThemeSaveValues,
} from '@/types/customTheme';
import { type ModalCustomThemeValues } from '@/types/formValues';

import { themeValidation } from '@/utils/themeValidation';
import { useMediaQuery } from '@mantine/hooks';

type ModalCustomThemeProps = {
	opened: boolean;
	onClose: () => void;
	title: string;
	saveCustomTheme: (name: string, themeColors: CustomThemeSaveValues) => Promise<void>;
	editCustomTheme: (
		name: string,
		oldName: string,
		themeColors: CustomThemeSaveValues,
	) => Promise<void>;
	mode: 'edit' | 'create';
	initialValues?: CustomTheme;
};

type CustomThemeFormColors = CustomThemeSaveValues & {
	'background-local': CustomThemeColors['background'];
};

const getCustomThemeErrorMessage = (error: unknown) => {
	if (error instanceof Error && error.message === 'CUSTOM_THEME_EXISTS') {
		return 'Theme under this name already exists, please try again with a different one.';
	}

	return 'Sorry, but something went wrong, please try again.';
};

const getEditThemeValues = (theme: CustomTheme): Partial<ModalCustomThemeValues> => {
	const backgroundColors = Object.fromEntries(
		theme.colors.background.map((value, index) => [`background${String(index)}`, value]),
	);

	const primaryColors = Object.fromEntries(
		theme.colors['custom-primary'].map((value, index) => [`primary${String(index)}`, value]),
	);

	return {
		customThemeName: theme.name.replace('created-theme-', '').replace(/-/g, ' '),
		backgroundBase: theme.colors.background[6],
		...backgroundColors,
		primaryBase: theme.colors['custom-primary'][6],
		...primaryColors,
		text: theme.other.text,
		oldCustomThemeName: theme.name,
	};
};

const getThemeColorValues = (
	values: ModalCustomThemeValues,
	isAdvancedSettingsOpen: boolean,
): CustomThemeFormColors => {
	const backgroundArray = isAdvancedSettingsOpen
		? Array.from(
				{ length: 10 },
				(_, index) => values[`background${index}` as keyof ModalCustomThemeValues] ?? '',
			)
		: [...generateColors(values.backgroundBase ?? '#1c1f24')];

	const primaryArray = isAdvancedSettingsOpen
		? Array.from(
				{ length: 10 },
				(_, index) => values[`primary${index}` as keyof ModalCustomThemeValues] ?? '',
			)
		: [...generateColors(values.primaryBase ?? '#228be6')];

	return {
		'background-local': backgroundArray.slice(
			0,
			8,
		) as unknown as CustomThemeColors['background'],
		background: backgroundArray as unknown as CustomThemeColors['background'],
		'custom-primary': primaryArray as unknown as CustomThemeColors['custom-primary'],
		text: values.text ?? '',
	};
};

const getThemeColorsForSave = (themeColors: CustomThemeFormColors): CustomThemeSaveValues => {
	return {
		background: themeColors.background,
		'custom-primary': themeColors['custom-primary'],
		text: themeColors.text,
	};
};

const getGeneratedBackgroundColors = (backgroundBase?: string) => {
	return [...generateColors(backgroundBase ?? '#1c1f24')];
};

const getGeneratedPrimaryColors = (primaryBase?: string) => {
	return [...generateColors(primaryBase ?? '#228be6')];
};

export const ModalCustomTheme = ({
	opened,
	onClose,
	title,
	saveCustomTheme,
	mode,
	initialValues,
	editCustomTheme,
}: ModalCustomThemeProps) => {
	const [activeStep, setActive] = useState(0);
	const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
	const isSmall = useMediaQuery('(max-width: 48em)');

	const { values, getInputProps, onSubmit, validate, setValues, reset, isValid } =
		useForm<ModalCustomThemeValues>({
			initialValues: {
				backgroundBase: '#1c1f24',
				primaryBase: '#228be6',
				text: '#101113',
				background8: '#ff00ff',
				background9: '#ff00ff',
				customThemeName: '',
			},
			validate: (formValues) =>
				themeValidation(activeStep, formValues, isAdvancedSettingsOpen),
		});

	const themeColors = useMemo(() => {
		if (activeStep !== 3) {
			return undefined;
		}

		return getThemeColorValues(values, isAdvancedSettingsOpen);
	}, [activeStep, isAdvancedSettingsOpen, values]);

	useEffect(() => {
		if (mode === 'edit' && initialValues) {
			setValues(getEditThemeValues(initialValues));
			setIsAdvancedSettingsOpen(false);
		} else {
			// making sure that the custom theme form is empty when going from the "edit" mode to the "create"
			reset();
			setIsAdvancedSettingsOpen(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode, initialValues]);

	const previousBaseColorsRef = useRef<{
		backgroundBase?: string;
		primaryBase?: string;
	} | null>(null);

	useEffect(() => {
		const previousBaseColors = previousBaseColorsRef.current;
		const isSameBaseColors =
			previousBaseColors?.backgroundBase === values.backgroundBase &&
			previousBaseColors?.primaryBase === values.primaryBase;

		if (isSameBaseColors) {
			return;
		}

		previousBaseColorsRef.current = {
			backgroundBase: values.backgroundBase,
			primaryBase: values.primaryBase,
		};

		const generatedBackground = getGeneratedBackgroundColors(values.backgroundBase);
		const generatedPrimary = getGeneratedPrimaryColors(values.primaryBase);

		const nextValues: Partial<ModalCustomThemeValues> = {};

		generatedBackground.forEach((color, index) => {
			const field = `background${String(index)}` as keyof ModalCustomThemeValues;
			nextValues[field] = color;
		});

		generatedPrimary.forEach((color, index) => {
			const field = `primary${String(index)}` as keyof ModalCustomThemeValues;
			nextValues[field] = color;
		});

		setValues(nextValues);
	}, [values.backgroundBase, values.primaryBase]);

	const nextStep = () => {
		setActive((current) => {
			if (validate().hasErrors) {
				return current;
			}

			return current < 3 ? current + 1 : current;
		});
	};

	const prevStep = () => {
		setActive((current) => (current > 0 ? current - 1 : current));
	};

	const handleCreateTheme = async (colors: CustomThemeSaveValues) => {
		try {
			await saveCustomTheme(values.customThemeName, colors);
			setActive(0);
			onClose();

			notifications.show({
				color: 'dark',
				message: `The ${values.customThemeName} theme was successfully created!`,
				autoClose: 3000,
			});
		} catch (error: unknown) {
			notifications.show({
				color: 'red',
				title: 'A new theme can not be created!',
				message: getCustomThemeErrorMessage(error),
				autoClose: 5000,
			});
		}
	};

	const handleEditTheme = async (colors: CustomThemeSaveValues) => {
		if (!values.oldCustomThemeName) {
			return;
		}

		try {
			await editCustomTheme(values.customThemeName, values.oldCustomThemeName, colors);
			setActive(0);
			onClose();

			notifications.show({
				color: 'dark',
				message: `The ${values.customThemeName} theme was successfully edited!`,
				autoClose: 3000,
			});
		} catch (error: unknown) {
			notifications.show({
				color: 'red',
				title: 'A theme can not be edited!',
				message: getCustomThemeErrorMessage(error),
				autoClose: 5000,
			});
		}
	};

	const handleSubmit = () => {
		if (!themeColors) {
			return;
		}

		const colors = getThemeColorsForSave(themeColors);

		if (mode === 'create') {
			void handleCreateTheme(colors);
			return;
		}

		void handleEditTheme(colors);
	};

	return (
		<Modal opened={opened} onClose={onClose} title={title} size="xl">
			<form onSubmit={onSubmit(handleSubmit)} noValidate>
				<Stepper
					active={activeStep}
					onStepClick={setActive}
					orientation={isSmall ? 'vertical' : 'horizontal'}
					size="md"
					mt={32}
					styles={{
						content: {
							paddingTop: 0,
						},
					}}
				>
					<Stepper.Step
						label="Background color"
						allowStepSelect={activeStep > 0}
						description="Generated from base color"
					>
						<Divider my={16} />

						<Text size="sm" mb={12}>
							Pick one background base color and the other shades will be generated
							automatically.
						</Text>

						<Box maw={360}>
							<ColorInput
								{...getInputProps('backgroundBase')}
								format="hex"
								label="Background base"
								description="Main color used to generate all background shades"
							/>
						</Box>

						<Group justify="space-between" mt={12}>
							<Text size="sm" fw={700}>
								Need full control? Open advanced settings.
							</Text>
							<UnstyledButton
								type="button"
								onClick={() => {
									setIsAdvancedSettingsOpen((current) => !current);
								}}
								style={{
									color: 'var(--mantine-color-blue-6)',
									fontSize: 'var(--mantine-font-size-sm)',
								}}
							>
								{isAdvancedSettingsOpen
									? 'Hide advanced settings'
									: 'Show advanced settings'}
							</UnstyledButton>
						</Group>

						<Divider my={16} />

						<Collapse expanded={isAdvancedSettingsOpen}>
							<SimpleGrid cols={3} spacing={24} style={{ alignItems: 'flex-start' }}>
								<ColorInput
									{...getInputProps('background0')}
									format="hex"
									label="Background 1"
									description="Main background color"
								/>
								<ColorInput
									{...getInputProps('background1')}
									format="hex"
									label="Background 2"
									description="Bookmarks cards, capsules and list"
								/>
								<ColorInput
									{...getInputProps('background2')}
									format="hex"
									label="Background 3"
									description="Hover, select and borders"
								/>

								<ColorInput
									{...getInputProps('background3')}
									format="hex"
									label="Background 4"
									description="Background color on icons hover"
								/>
								<ColorInput
									{...getInputProps('background4')}
									format="hex"
									label="Background 5"
									description="Inputs border"
								/>
								<ColorInput
									{...getInputProps('background5')}
									format="hex"
									label="Background 6"
									description="Nothing found on select"
								/>

								<ColorInput
									{...getInputProps('background6')}
									format="hex"
									label="Background 7"
									description="Dimmed text color"
								/>
								<ColorInput
									{...getInputProps('background7')}
									format="hex"
									label="Background 8"
									description="Up and down icon on select component"
								/>
							</SimpleGrid>
						</Collapse>
					</Stepper.Step>

					<Stepper.Step
						label="Primary color"
						allowStepSelect={activeStep > 1}
						description="Generated from base color"
					>
						<Divider my={16} />

						<Text size="sm" mb={12}>
							The primary color of your custom theme sets color for every button and
							other actionable elements in the extension. Also keep in mind that
							Primary 7 is the main shade that you will see the most often across the
							extension.
						</Text>

						<Box maw={360}>
							<ColorInput
								{...getInputProps('primaryBase')}
								format="hex"
								label="Primary base"
								description="Base color used to generate all primary shades"
							/>
						</Box>

						<Group justify="space-between" mt={12}>
							<Text size="sm" fw={700}>
								Need full control? Open advanced settings.
							</Text>
							<UnstyledButton
								type="button"
								onClick={() => {
									setIsAdvancedSettingsOpen((current) => !current);
								}}
								style={{
									color: 'var(--mantine-color-blue-6)',
									fontSize: 'var(--mantine-font-size-sm)',
								}}
							>
								{isAdvancedSettingsOpen
									? 'Hide advanced settings'
									: 'Show advanced settings'}
							</UnstyledButton>
						</Group>

						<Divider my={16} />

						<Collapse expanded={isAdvancedSettingsOpen}>
							<SimpleGrid
								cols={3}
								spacing={24}
								style={{ alignItems: 'flex-start', rowGap: 16 }}
							>
								<ColorInput
									{...getInputProps('primary0')}
									format="hex"
									label="Primary 1"
								/>
								<ColorInput
									{...getInputProps('primary1')}
									format="hex"
									label="Primary 2"
								/>
								<ColorInput
									{...getInputProps('primary2')}
									format="hex"
									label="Primary 3"
								/>

								<ColorInput
									{...getInputProps('primary3')}
									format="hex"
									label="Primary 4"
								/>
								<ColorInput
									{...getInputProps('primary4')}
									format="hex"
									label="Primary 5"
								/>
								<ColorInput
									{...getInputProps('primary5')}
									format="hex"
									label="Primary 6"
								/>

								<ColorInput
									{...getInputProps('primary6')}
									format="hex"
									label="Primary 7"
									styles={(theme) => ({
										input: {
											borderColor: theme.colors[theme.primaryColor][6],
										},
									})}
								/>
								<ColorInput
									{...getInputProps('primary7')}
									format="hex"
									label="Primary 8"
								/>
								<ColorInput
									{...getInputProps('primary8')}
									format="hex"
									label="Primary 9"
								/>
								<ColorInput
									{...getInputProps('primary9')}
									format="hex"
									label="Primary 10"
								/>
							</SimpleGrid>
						</Collapse>
					</Stepper.Step>

					<Stepper.Step
						label="Text color"
						allowStepSelect={activeStep > 2}
						description="Main text color"
					>
						<Divider my={16} />

						<SimpleGrid cols={3} spacing={24}>
							<ColorInput
								{...getInputProps('text')}
								format="hex"
								label="Text color"
								description="Text color used in the whole app"
							/>
						</SimpleGrid>
					</Stepper.Step>

					<Stepper.Completed>
						<Divider my={16} />

						<Group grow gap={32} justify="flex-start">
							<Stack>
								<Text>Preview of all selected colors:</Text>

								<Group gap={24}>
									<div>
										<Text size="sm">Background colors:</Text>
										<Group gap={2}>
											{(themeColors?.['background-local'] ?? []).map(
												(color, index) => (
													<Box
														key={`${color}-${String(index)}`}
														style={{
															backgroundColor: color,
															width: 24,
															height: 24,
														}}
													/>
												),
											)}
										</Group>

										<Text size="sm">Primary colors:</Text>
										<Group gap={2}>
											{themeColors?.['custom-primary'].map((color) => (
												<Box
													key={color}
													style={{
														backgroundColor: color,
														width: 24,
														height: 24,
													}}
												/>
											))}
										</Group>
									</div>

									<div>
										<Text size="sm">Text color:</Text>
										<Box
											style={{
												backgroundColor:
													themeColors?.['background-local'][0],
												width: 68,
												height: 68,
												justifyContent: 'center',
												alignItems: 'center',
												display: 'flex',
											}}
										>
											<Text
												fw="bold"
												size="lg"
												style={{
													color: themeColors?.text,
												}}
											>
												Text
											</Text>
										</Box>
									</div>
								</Group>
							</Stack>

							<Stack justify="flex-start">
								<Text>Extra settings for custom theme:</Text>

								<TextInput
									{...getInputProps('customThemeName')}
									label="Theme name"
									required
									placeholder="e.g. Custom Theme 1"
									styles={{
										input: {
											textTransform: 'capitalize',
										},
									}}
								/>
							</Stack>
						</Group>
					</Stepper.Completed>
				</Stepper>

				<Group justify="flex-end" mt="xl">
					<Button variant="default" onClick={prevStep}>
						Back
					</Button>

					{activeStep < 3 && (
						<Button onClick={nextStep} disabled={!isValid()}>
							Next Step
						</Button>
					)}

					{activeStep === 3 && (
						<Button type="submit" disabled={!isValid()}>
							Save
						</Button>
					)}
				</Group>
			</form>
		</Modal>
	);
};
