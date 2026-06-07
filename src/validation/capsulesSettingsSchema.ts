import { z } from 'zod';

export const capsulesSettingsSchema = z.object({
	capsuleSize: z.int().min(0),
	capsuleSpacing: z.int().min(0),
	capsuleIconSize: z.int().min(0).max(256),
	capsuleLabelSize: z.int().min(0),
	capsuleLabelColor: z.string(),
	capsuleLabelBold: z.boolean(),
	capsuleLabelItalic: z.boolean(),
	capsuleHiddenName: z.boolean(),
});
