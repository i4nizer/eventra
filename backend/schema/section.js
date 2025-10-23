import z from "zod"

//

const SectionSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    year: z.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const SectionCreateSchema = SectionSchema.pick({
	name: true,
	year: true,
})

const SectionUpdateSchema = SectionSchema.pick({
	name: true,
	year: true,
}).partial()

//

export default { SectionSchema, SectionCreateSchema, SectionUpdateSchema }