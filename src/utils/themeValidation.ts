import { backgroundColorSchema } from '../validation/backgroundColorSchema';
import { primaryColorSchema } from '../validation/primaryColorSchema';
import { textColorSchema } from '../validation/textColorSchema';
import { customThemeSchema } from '../validation/customThemeSchema';
import { themeErrorMap } from '../validation/themeErrorMap';

export const themeValidation = (activeStep: number, values: Record<string, unknown>) => {
	let result; // correct type here

	if (activeStep === 0) {
		result = backgroundColorSchema.safeParse(values, { errorMap: themeErrorMap });
	} else if (activeStep === 1) {
		result = primaryColorSchema.safeParse(values, { errorMap: themeErrorMap });
	} else if (activeStep === 2) {
		result = textColorSchema.safeParse(values, { errorMap: themeErrorMap });
	} else if (activeStep === 3) {
		result = customThemeSchema.safeParse(values, { errorMap: themeErrorMap });
	}

	const errors: any = result?.success ? {} : result?.error.flatten();

	if (errors?.fieldErrors) {
		Object.keys(errors.fieldErrors).forEach((key) => {
			errors.fieldErrors[key] = errors.fieldErrors[key][0];
		});

		return errors?.fieldErrors;
	} else {
		return {};
	}
};
