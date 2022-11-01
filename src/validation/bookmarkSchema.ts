import { z } from 'zod';

export const bookmarkSchema = z.object({
	bookmarkName: z.string().min(1, { message: 'Bookmark name is required' }),
	bookmarkUrl: z
		.string()
		.min(1)
		.regex(/^(?:f|ht)tps?:\/\//, { message: 'Bookmark URL needs to start with "https://"' }),
	bookmarkCategoryId: z.string().nullable(),
});
