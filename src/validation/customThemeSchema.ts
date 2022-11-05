import { z } from 'zod';

export const customThemeSchema = z.object({
	customThemeName: z
		.string()
		.min(1)
		.regex(/^[a-zA-Z\s]*$/, { message: 'No special characters are allowed, except spaces' }),
});
