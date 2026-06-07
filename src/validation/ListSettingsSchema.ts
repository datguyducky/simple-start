import { z } from 'zod';

export const listSettingsSchema = z.object({
	listUseStrippedRows: z.boolean(),
	listVerticalPadding: z.int().min(0),
	listHorizontalPadding: z.int().min(0),
	listSpacing: z.int().min(0),
	listNameSize: z.int().min(0),
	listUrlSize: z.int().min(0),
	listIconSize: z.int().min(0).max(256),
	listNameColor: z.string(),
	listUrlColor: z.string(),
	listNameBold: z.boolean(),
	listUrlBold: z.boolean(),
	listNameItalic: z.boolean(),
	listUrlItalic: z.boolean(),
	listHiddenName: z.boolean(),
	listHiddenUrl: z.boolean(),
});
