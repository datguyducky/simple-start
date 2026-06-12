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
import { useForm, schemaResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { constants } from '@/common/constants';
import { type CapsuleSettings } from '@/types/settingsValues';

import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';

import { BookmarkCapsule } from '@/components/BookmarkCapsule';
import { capsulesSettingsSchema } from '@/validation/capsulesSettingsSchema';

type CapsulesSettingsFormProps = {
	openResetModal: () => void;
};

export const CapsulesSettingsForm = ({ openResetModal }: CapsulesSettingsFormProps) => {
	const { extensionSettings, saveExtensionSettings, hasCapsuleSettingsChanged } =
		useExtensionSettings();

	const form = useForm<CapsuleSettings>({
		validate: schemaResolver(capsulesSettingsSchema),
		validateInputOnChange: true,
	});

	useEffect(() => {
		if (Object.keys(extensionSettings).length) {
			const capsuleSettings = Object.fromEntries(
				Object.entries(extensionSettings).filter(([key]) => key.includes('capsule')),
			) as CapsuleSettings;

			const values = {
				...capsuleSettings,
				capsuleLabelColor:
					capsuleSettings.capsuleLabelColor === null
						? ''
						: capsuleSettings.capsuleLabelColor,
			};

			form.setValues(values);
			form.resetDirty(values);
		}
	}, [extensionSettings]);

	const handleSaveExtensionSettings = (formValues: CapsuleSettings) => {
		if (!form.isDirty()) {
			return;
		}

		handleAsyncAction(
			async () => {
				await wait(600);
				await saveExtensionSettings(formValues);

				notifications.show({
					color: 'dark',
					message: 'Settings for capsule view were successfully saved!',
					autoClose: 3000,
				});
			},
			{
				errorTitle: 'Settings could not be saved!',
			},
		);

		form.resetDirty();
	};

	return (
		<Box onSubmit={form.onSubmit(handleSaveExtensionSettings)} noValidate component="form">
			<SimpleGrid cols={2} spacing={16} mb={24}>
				<Stack gap={12} align="flex-start">
					<NumberInput label="Capsule size" {...form.getInputProps('capsuleSize')} />

					<NumberInput
						label="Space between capsules"
						{...form.getInputProps('capsuleSpacing')}
					/>

					<NumberInput label="Favicon size" {...form.getInputProps('capsuleIconSize')} />

					<Group align="flex-start">
						<NumberInput
							label="Labels size"
							{...form.getInputProps('capsuleLabelSize')}
						/>

						<ColorInput
							{...form.getInputProps('capsuleLabelColor')}
							format="hex"
							label="Label color"
						/>
					</Group>

					<Checkbox
						label="Use bold text for labels"
						{...form.getInputProps('capsuleLabelBold', {
							type: 'checkbox',
						})}
					/>

					<Checkbox
						label="Use italic text for labels"
						{...form.getInputProps('capsuleLabelItalic', {
							type: 'checkbox',
						})}
					/>

					<Checkbox
						label="Hide labels for bookmarks"
						{...form.getInputProps('capsuleHiddenName', {
							type: 'checkbox',
						})}
					/>
				</Stack>

				<Group gap={0}>
					<Divider orientation="vertical" mr={16} />

					<Group gap={form.values.capsuleSpacing} mx="auto">
						{constants.exampleBookmarks.map((bookmark) => (
							<BookmarkCapsule
								key={bookmark.id}
								title={bookmark.name}
								url={bookmark.url}
								settings={form.values}
							/>
						))}
					</Group>
				</Group>
			</SimpleGrid>

			<Group justify="center" w="100%" ml={-24} mt={0}>
				<Button
					variant="outline"
					onClick={openResetModal}
					disabled={!hasCapsuleSettingsChanged()}
				>
					Reset to default
				</Button>
				<Button type="submit" disabled={!form.isValid() || !form.isDirty()}>
					Save
				</Button>
			</Group>
		</Box>
	);
};
