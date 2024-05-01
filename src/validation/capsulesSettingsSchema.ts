import { z } from 'zod';

export const capsulesSettingsSchema = z.object({
	capsuleSize: z.number().int().min(0),
	capsuleSpacing: z.number().int().min(0),
	capsuleIconSize: z.number().int().min(0).max(256),
	capsuleLabelSize: z.number().int().min(0),
	capsuleLabelColor: z.string(),
	capsuleLabelBold: z.boolean(),
	capsuleLabelItalic: z.boolean(),
	capsuleHiddenName: z.boolean(),
});
