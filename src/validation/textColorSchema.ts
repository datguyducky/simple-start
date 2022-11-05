import { z } from 'zod';

export const textColorSchema = z.object({
	text: z.string().min(4).max(9).regex(/^#/),
});
