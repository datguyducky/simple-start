import { z } from 'zod';

export const customThemeSchema = z.object({
	customThemeName: z
		.string()
		.min(1)
		.regex(/^[a-zA-Z\s]*$/, {
            error: 'No special characters are allowed, except spaces'
        }),
});
