import z from "zod"

//

const PaymentSchema = z.object({
    id: z.number().int(),
    value: z.coerce.number().int(),
    remarks: z.coerce.string().default(""),
    violationId: z.coerce.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const PaymentCreateSchema = PaymentSchema.pick({ value: true, remarks: true })
const PaymentUpdateSchema = PaymentSchema.pick({ value: true, remarks: true }).partial()

//

export default { PaymentSchema, PaymentCreateSchema, PaymentUpdateSchema }