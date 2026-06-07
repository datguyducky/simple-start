import { z } from 'zod';

export const generalSettingsSchema = z.object({
	oneView: z.boolean(),
	oneViewHeadingGap: z.number().min(0),
	oneViewCategoriesGap: z.number().min(0),
});
