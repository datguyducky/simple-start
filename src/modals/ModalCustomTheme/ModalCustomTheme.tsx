import { useEffect, useMemo, useState } from 'react';
import {
	ColorInput,
	Modal,
	Stepper,
	SimpleGrid,
	Group,
	Button,
	Text,
	Divider,
	Box,
	Stack,
	TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

import {
	type ColorsArray,
	type CustomTheme,
	type CustomThemeColors,
	type CustomThemeFormColors,
} from '@/types/customTheme';
import { type ModalCustomThemeValues } from '@/types/formValues';

import { themeValidation } from '@/utils/themeValidation';

type ModalCustomThemeProps = {
	opened: boolean;
	onClose: () => void;
	title: string;
	saveCustomTheme: (name: string, themeColors: CustomThemeColors) => Promise<void>;
	editCustomTheme: (
		name: string,
		oldName: string,
		themeColors: CustomThemeColors,
	) => Promise<void>;
	mode: 'edit' | 'create';
	initialValues?: CustomTheme;
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
		...backgroundColors,
		...primaryColors,
		text: theme.colors.text,
		oldCustomThemeName: theme.name,
	};
};

const getThemeColorValues = (values: ModalCustomThemeValues): CustomThemeFormColors => {
	const backgroundArray: string[] = [];
	const primaryArray: string[] = [];
	const backgroundLocalArray: string[] = [];

	for (const [key, color] of Object.entries(values).sort()) {
		if (key.startsWith('background')) {
			if (key !== 'background8' && key !== 'background9') {
				backgroundLocalArray.push(color);
			}

			backgroundArray.push(color);
			continue;
		}

		if (key.startsWith('primary')) {
			primaryArray.push(color);
		}
	}

	return {
		'background-local': backgroundLocalArray as ColorsArray,
		background: backgroundArray as ColorsArray,
		'custom-primary': primaryArray as ColorsArray,
		text: values.text ?? '',
	};
};

const getThemeColorsForSave = (themeColors: CustomThemeFormColors): CustomThemeColors => {
	return {
		background: themeColors.background,
		'custom-primary': themeColors['custom-primary'],
		text: themeColors.text,
	};
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

	const { values, getInputProps, onSubmit, validate, setValues, reset, isValid } =
		useForm<ModalCustomThemeValues>({
			initialValues: {
				text: '#101113',
				background8: '#ff00ff',
				background9: '#ff00ff',
				customThemeName: '',
			},
			validate: (formValues) => themeValidation(activeStep, formValues),
		});

	const themeColors = useMemo(() => {
		if (activeStep !== 3) {
			return undefined;
		}

		return getThemeColorValues(values);
	}, [activeStep, values]);

	useEffect(() => {
		if (mode === 'edit' && initialValues) {
			setValues(getEditThemeValues(initialValues));
		} else {
			// making sure that the custom theme form is empty when going from the "edit" mode to the "create"
			reset();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode, initialValues]);

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

	const handleCreateTheme = async (colors: CustomThemeColors) => {
		try {
			await saveCustomTheme(values.customThemeName, colors);
			setActive(0);
			onClose();

			showNotification({
				color: 'dark',
				message: `The ${values.customThemeName} theme was successfully created!`,
				autoClose: 3000,
			});
		} catch (error: unknown) {
			showNotification({
				color: 'red',
				title: 'A new theme can not be created!',
				message: getCustomThemeErrorMessage(error),
				autoClose: 5000,
			});
		}
	};

	const handleEditTheme = async (colors: CustomThemeColors) => {
		if (!values.oldCustomThemeName) {
			return;
		}

		try {
			await editCustomTheme(values.customThemeName, values.oldCustomThemeName, colors);
			setActive(0);
			onClose();

			showNotification({
				color: 'dark',
				message: `The ${values.customThemeName} theme was successfully edited!`,
				autoClose: 3000,
			});
		} catch (error: unknown) {
			showNotification({
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
					breakpoint="sm"
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
						description="8 shades of background color"
					>
						<Divider my={16} />

						<Text size="sm" mb={12}>
							In order to create your own theme you need to input a couple of colors
							of your choice, and in some cases you may also be required to generate a
							couple of shades per color.
							<br />
							<br />
							Although I will not list any tools for that, you may easily find shade
							generators on the internet, so when needed please use that and remember
							that you can tweak every color separately for your needs.
						</Text>

						<Text size="sm" weight={700}>
							Shade for this should look like this: Background 1(lightest) -
							Background 8(darkest)
						</Text>

						<Divider my={16} />

						<SimpleGrid cols={3} spacing={24} sx={{ alignItems: 'flex-start' }}>
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
					</Stepper.Step>

					<Stepper.Step
						label="Primary color"
						allowStepSelect={activeStep > 1}
						description="10 shades of primary color"
					>
						<Divider my={16} />

						<Text size="sm" mb={12}>
							The primary color of your custom theme sets color for every button and
							other actionable elements in the extension. Also keep in mind that
							Primary 7 is the main shade that you will see the most often across the
							extension.
							<br />
							<br />
							As you can see in the built-in themes the primary color is set as a blue
							color.
						</Text>

						<Divider my={16} />

						<SimpleGrid
							cols={3}
							spacing={24}
							sx={{ alignItems: 'flex-start', rowGap: 16 }}
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

						<Group grow spacing={32} sx={{ alignItems: 'flex-start' }}>
							<Stack>
								<Text>Preview of all selected colors:</Text>

								<Group spacing={24}>
									<div>
										<Text size="sm">Background colors:</Text>
										<Group spacing={2}>
											{themeColors?.['background-local'].map((color) => (
												<Box
													key={color}
													sx={{
														backgroundColor: color,
														width: 24,
														height: 24,
													}}
												/>
											))}
										</Group>

										<Text size="sm">Primary colors:</Text>
										<Group spacing={2}>
											{themeColors?.['custom-primary'].map((color) => (
												<Box
													key={color}
													sx={{
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
											sx={{
												width: 68,
												height: 68,
												justifyContent: 'center',
												alignItems: 'center',
												display: 'flex',
												backgroundColor:
													themeColors?.['background-local'][0],
											}}
										>
											<Text
												weight="bold"
												size="lg"
												sx={{
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

				<Group position="right" mt="xl">
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
