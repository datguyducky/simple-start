import { useEffect } from 'react';
import {
	Box,
	SimpleGrid,
	Button,
	Stack,
	NumberInput,
	Checkbox,
	Group,
	Divider,
} from '@mantine/core';
import { useForm, schemaResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { type GeneralSettings } from '@/types/settingsValues';
import { useExtensionSettings } from '@/hooks/useExtensionSettings';
import { handleAsyncAction } from '@/utils/handleAsyncAction';
import { wait } from '@/utils/wait';
import { generalSettingsSchema } from '@/validation/generalSettingsSchema';

type GeneralSettingsFormProps = {
	openResetModal: () => void;
};

export const GeneralSettingsForm = ({ openResetModal }: GeneralSettingsFormProps) => {
	const { extensionSettings, saveExtensionSettings, hasGeneralSettingsChanged } =
		useExtensionSettings();

	const form = useForm<GeneralSettings>({
		validate: schemaResolver(generalSettingsSchema),
		validateInputOnChange: true,
	});

	useEffect(() => {
		if (Object.keys(extensionSettings).length) {
			const values = {
				oneView: extensionSettings.oneView,
				oneViewHeadingGap: extensionSettings.oneViewHeadingGap,
				oneViewCategoriesGap: extensionSettings.oneViewCategoriesGap,
			};

			form.setValues(values);
			form.resetDirty(values);
		}
	}, [extensionSettings]);

	const handleSaveExtensionSettings = (formValues: GeneralSettings) => {
		if (!form.isDirty()) {
			return;
		}

		handleAsyncAction(
			async () => {
				await wait(600);
				await saveExtensionSettings(formValues);

				notifications.show({
					color: 'dark',
					message: 'General settings were successfully saved!',
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
		<Stack>
			<Box component="form" onSubmit={form.onSubmit(handleSaveExtensionSettings)} noValidate>
				<Stack gap={16} mb={24}>
					<Checkbox
						label="One view mode"
						description="Display all categories and their bookmarks in a single view"
						{...form.getInputProps('oneView', { type: 'checkbox' })}
					/>

					{form.values.oneView && (
						<SimpleGrid cols={2} spacing={16}>
							<NumberInput
								label="Heading gap"
								description="Spacing below the category title"
								min={0}
								{...form.getInputProps('oneViewHeadingGap')}
							/>
							<NumberInput
								label="Categories gap"
								description="Spacing between categories"
								min={0}
								{...form.getInputProps('oneViewCategoriesGap')}
							/>
						</SimpleGrid>
					)}
				</Stack>

				<Divider mb={16} />

				<Group justify="center" w="100%" ml={-24} mt={0}>
					<Button
						variant="outline"
						onClick={openResetModal}
						disabled={!hasGeneralSettingsChanged()}
					>
						Reset to default
					</Button>
					<Button type="submit" disabled={!form.isValid() || !form.isDirty()}>
						Save
					</Button>
				</Group>
			</Box>
		</Stack>
	);
};
