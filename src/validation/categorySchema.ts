import { z } from 'zod';

export const categorySchema = z.object({
	categoryName: z.string().min(1, { message: 'Category name is required' }),
	defaultCategory: z.boolean().optional(),
});
