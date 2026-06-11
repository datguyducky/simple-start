import { z } from 'zod';

import { isSupportedBookmarkUrl } from '@/utils/bookmarkUrl';

export const bookmarkSchema = z.object({
	bookmarkName: z.string().min(1, {
		error: 'Bookmark name is required',
	}),
	bookmarkUrl: z
		.string()
		.trim()
		.min(1, {
			error: 'Bookmark URL is required',
		})
		.refine((url) => isSupportedBookmarkUrl(url), {
			error: 'Enter a valid website URL',
		}),
});
