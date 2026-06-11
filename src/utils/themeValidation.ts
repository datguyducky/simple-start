import { z, ZodSafeParseResult } from 'zod';

import { backgroundColorSchema } from '@/validation/backgroundColorSchema';
import { primaryColorSchema } from '@/validation/primaryColorSchema';
import { textColorSchema } from '@/validation/textColorSchema';
import { customThemeSchema } from '@/validation/customThemeSchema';
import { themeErrorMap } from '@/validation/themeErrorMap';

type ThemeValidationErrors = Record<string, string>;

const completeCustomThemeFormSchema = z
	.object({})
	.extend({
		backgroundBase: z.string().min(4).max(9).regex(/^#/),
		primaryBase: z.string().min(4).max(9).regex(/^#/),
	})
	.extend(backgroundColorSchema.shape)
	.extend(primaryColorSchema.shape)
	.extend(textColorSchema.shape)
	.extend(customThemeSchema.shape);

const completeBasicCustomThemeFormSchema = z
	.object({
		backgroundBase: z.string().min(4).max(9).regex(/^#/),
		primaryBase: z.string().min(4).max(9).regex(/^#/),
	})
	.extend(textColorSchema.shape)
	.extend(customThemeSchema.shape);

const getValidationResult = (
	activeStep: number,
	values: Record<string, unknown>,
	isAdvancedSettingsOpen: boolean,
): ZodSafeParseResult<unknown> | undefined => {
	if (!isAdvancedSettingsOpen) {
		if (activeStep === 0) {
			return z
				.object({
					backgroundBase: z.string().min(4).max(9).regex(/^#/),
				})
				.safeParse(values, { error: themeErrorMap });
		}

		if (activeStep === 1) {
			return z
				.object({
					primaryBase: z.string().min(4).max(9).regex(/^#/),
				})
				.safeParse(values, { error: themeErrorMap });
		}

		if (activeStep === 3) {
			return completeBasicCustomThemeFormSchema.safeParse(values, {
				error: themeErrorMap,
			});
		}
	}

	if (activeStep === 0) {
		return backgroundColorSchema.safeParse(values, { error: themeErrorMap });
	}

	if (activeStep === 1) {
		return primaryColorSchema.safeParse(values, { error: themeErrorMap });
	}

	if (activeStep === 2) {
		return textColorSchema.safeParse(values, { error: themeErrorMap });
	}

	if (activeStep === 3) {
		return completeCustomThemeFormSchema.safeParse(values, { error: themeErrorMap });
	}

	return undefined;
};

export const themeValidation = (
	activeStep: number,
	values: Record<string, unknown>,
	isAdvancedSettingsOpen: boolean,
): ThemeValidationErrors => {
	const result = getValidationResult(activeStep, values, isAdvancedSettingsOpen);

	if (result === undefined || result.success) {
		return {};
	}

	const errors: ThemeValidationErrors = {};

	for (const issue of result.error.issues) {
		const [fieldName] = issue.path;

		if (typeof fieldName === 'string' && !(fieldName in errors)) {
			errors[fieldName] = issue.message;
		}
	}

	return errors;
};
