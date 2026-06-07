import { z } from 'zod';

export const themeErrorMap: z.core.$ZodErrorMap = (issue) => {
	// if issue.message is passed then we don't try to overwrite it
	if (issue.message) return { message: issue.message };

	switch (issue.code) {
		case 'too_small':
			if (issue.minimum === 4) {
				return {
					message:
						'The color must be at least in shorthand hex format, for example: #333',
				};
			}
			break;

		case 'invalid_format':
			if (issue.format === 'regex') {
				return {
					message: 'Color must be in a HEX format, for example "#000000"',
				};
			}
			break;
	}

	// fall back to Zod's default message
	return undefined;
};
