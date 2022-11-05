import { z } from 'zod';

export const primaryColorSchema = z.object({
	primary0: z.string().min(4).max(9).regex(/^#/),
	primary1: z.string().min(4).max(9).regex(/^#/),
	primary2: z.string().min(4).max(9).regex(/^#/),
	primary3: z.string().min(4).max(9).regex(/^#/),
	primary4: z.string().min(4).max(9).regex(/^#/),
	primary5: z.string().min(4).max(9).regex(/^#/),
	primary6: z.string().min(4).max(9).regex(/^#/),
	primary7: z.string().min(4).max(9).regex(/^#/),
	primary8: z.string().min(4).max(9).regex(/^#/),
	primary9: z.string().min(4).max(9).regex(/^#/),
});
