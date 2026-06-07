import { z } from 'zod';

export const categorySchema = z.object({
	categoryName: z.string().min(1, {
        error: 'Category name is required'
    }),
	defaultCategory: z.boolean().optional(),
});
