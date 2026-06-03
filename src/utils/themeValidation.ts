import { type SafeParseReturnType } from 'zod';

import { backgroundColorSchema } from '@/validation/backgroundColorSchema';
import { primaryColorSchema } from '@/validation/primaryColorSchema';
import { textColorSchema } from '@/validation/textColorSchema';
import { customThemeSchema } from '@/validation/customThemeSchema';
import { themeErrorMap } from '@/validation/themeErrorMap';

type ThemeValidationErrors = Record<string, string>;

const getValidationResult = (
	activeStep: number,
	values: Record<string, unknown>,
): SafeParseReturnType<unknown, unknown> | undefined => {
	if (activeStep === 0) {
		return backgroundColorSchema.safeParse(values, { errorMap: themeErrorMap });
	}

	if (activeStep === 1) {
		return primaryColorSchema.safeParse(values, { errorMap: themeErrorMap });
	}

	if (activeStep === 2) {
		return textColorSchema.safeParse(values, { errorMap: themeErrorMap });
	}

	if (activeStep === 3) {
		return customThemeSchema.safeParse(values, { errorMap: themeErrorMap });
	}

	return undefined;
};

export const themeValidation = (
	activeStep: number,
	values: Record<string, unknown>,
): ThemeValidationErrors => {
	const result = getValidationResult(activeStep, values);

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
