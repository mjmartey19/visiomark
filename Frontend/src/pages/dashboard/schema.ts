import { z } from 'zod';

export const schema = z.object({
  course_code: z.string().min(5).toUpperCase(),
  department_code: z
    .string({
      required_error: 'Error',
      invalid_type_error: 'Should be a number',
    })
    .min(3, { message: 'Department code must be 3 digits' })
    .max(3),

  number_of_questions: z.string().max(200),
});
