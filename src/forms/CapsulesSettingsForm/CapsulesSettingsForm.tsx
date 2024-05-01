import { useEffect } from 'react';
import {
	SimpleGrid,
	Button,
	Stack,
	NumberInput,
	Checkbox,
	ColorInput,
	Group,
	Divider,
	Box,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';

import { constants } from '@common/constants';
import { CapsuleSettings } from '@extensionTypes/settingsValues';

import { useExtensionSettings } from '@hooks/useExtensionSettings';

import { BookmarkCapsule } from '@components/BookmarkCapsule';
import { showNotification } from '@mantine/notifications';
import { capsulesSettingsSchema } from '@validation/capsulesSettingsSchema';

type CapsulesSettingsFormProps = {
	openResetModal: () => void;
};

export const CapsulesSettingsForm = ({ openResetModal }: CapsulesSettingsFormProps) => {
	const { extensionSettings, saveExtensionSettings, hasCapsuleSettingsChanged } =
		useExtensionSettings();

	const { getInputProps, setValues, onSubmit, values, resetDirty, isDirty, isValid } =
		useForm<CapsuleSettings>({
			validate: zodResolver(capsulesSettingsSchema),
			validateInputOnChange: true,
		});

	useEffect(() => {
		if (extensionSettings) {
			const capsuleSettings = Object.fromEntries(
				Object.entries(extensionSettings).filter(([key]) => key.includes('capsule')),
			) as CapsuleSettings;

			setValues({
				...capsuleSettings,
				capsuleLabelColor:
					capsuleSettings.capsuleLabelColor === null
						? ''
						: capsuleSettings.capsuleLabelColor,
			});

			resetDirty();
		}
	}, [extensionSettings]);

	const handleSaveExtensionSettings = async (formValues: typeof values) => {
		if (isDirty()) {
			setTimeout(async () => {
				try {
					await saveExtensionSettings(formValues);

					showNotification({
						color: 'dark',
						message: 'Settings for capsule view were successfully saved!',
						autoClose: 3000,
					});
				} catch (error) {
					showNotification({
						color: 'red',
						title: 'Settings could not be saved!',
						message: 'Sorry, but something went wrong, please try again.',
						autoClose: 5000,
					});
				}
			}, 600);

			resetDirty();
		}
	};

	return (
		<Box onSubmit={onSubmit(handleSaveExtensionSettings)} noValidate mb={32} component="form">
			<SimpleGrid cols={2} spacing={16} mb={24}>
				<Stack spacing={12} align="flex-start">
					<NumberInput label="Capsule size" {...getInputProps('capsuleSize')} />

					<NumberInput
						label="Space between capsules"
						{...getInputProps('capsuleSpacing')}
					/>

					<NumberInput label="Favicon size" {...getInputProps('capsuleIconSize')} />

					<Group align="flex-start">
						<NumberInput label="Labels size" {...getInputProps('capsuleLabelSize')} />

						<ColorInput
							{...getInputProps('capsuleLabelColor')}
							format="hex"
							label="Label color"
						/>
					</Group>

					<Checkbox
						label="Use bold text for labels"
						{...getInputProps('capsuleLabelBold', {
							type: 'checkbox',
						})}
					/>

					<Checkbox
						label="Use italic text for labels"
						{...getInputProps('capsuleLabelItalic', {
							type: 'checkbox',
						})}
					/>

					<Checkbox
						label="Hide labels for bookmarks"
						{...getInputProps('capsuleHiddenName', {
							type: 'checkbox',
						})}
					/>
				</Stack>

				<Group spacing={0}>
					<Divider orientation="vertical" mr={16} />

					<Group spacing={values.capsuleSpacing} mx="auto">
						{constants.exampleBookmarks.map((bookmark) => (
							<BookmarkCapsule
								key={bookmark.id}
								title={bookmark.name}
								url={bookmark?.url}
								settings={values}
							/>
						))}
					</Group>
				</Group>
			</SimpleGrid>

			<Group position="center" sx={{ width: '100%', marginLeft: '-28px' }} mt={0}>
				<Button
					variant="outline"
					onClick={openResetModal}
					disabled={!hasCapsuleSettingsChanged()}
				>
					Reset to default
				</Button>
				<Button type="submit" disabled={!isValid() || !isDirty()}>
					Save
				</Button>
			</Group>
		</Box>
	);
};
