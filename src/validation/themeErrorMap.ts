import { z } from 'zod';

export const themeErrorMap: z.ZodErrorMap = (error, ctx) => {
	// if error.message is passed then we don't try to overwrite it
	if (error.message) return { message: error.message };

	switch (error.code) {
		case z.ZodIssueCode.too_small:
			if (error.minimum === 4) {
				return {
					message:
						'The color must be at least in shorthand hex format, for example: #333',
				};
			}
			break;
		case z.ZodIssueCode.invalid_string:
			if (error.validation === 'regex') {
				return {
					message: 'Color must be in a HEX format, for example "#000000"',
				};
			}
			break;
	}

	// fall back to default message
	return { message: ctx.defaultError };
};
