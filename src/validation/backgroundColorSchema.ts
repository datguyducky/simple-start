import { z } from 'zod';

export const backgroundColorSchema = z.object({
	background0: z.string().min(4).max(9).regex(/^#/),
	background1: z.string().min(4).max(9).regex(/^#/),
	background2: z.string().min(4).max(9).regex(/^#/),
	background3: z.string().min(4).max(9).regex(/^#/),
	background4: z.string().min(4).max(9).regex(/^#/),
	background5: z.string().min(4).max(9).regex(/^#/),
	background6: z.string().min(4).max(9).regex(/^#/),
	background7: z.string().min(4).max(9).regex(/^#/),
	background8: z.string().min(4).max(9).regex(/^#/),
	background9: z.string().min(4).max(9).regex(/^#/),
});
