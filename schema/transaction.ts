import { z } from "zod"

export const CreateTransactionSchema = z.object({
    amount: z.coerce.number().positive().multipleOf(0.01),
    description: z.string().optional(),
    date: z.coerce.date(),
    category: z.string(),
    //esquema que valida se o valor é exatamente igual a um valor literal específico
    type: z.union([
        z.literal("renda"),
        z.literal("despesa")
    ])
});

export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>