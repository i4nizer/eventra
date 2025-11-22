import z from "zod"

//

const ActivitySchema = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    fine: z.coerce.number().min(0).default(20),
    description: z.string().default(""),
    startAt: z.coerce.date(),
    finishAt: z.coerce.date(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const ActivityCreateSchema = ActivitySchema.pick({
    name: true,
    fine: true,
    description: true,
    startAt: true,
    finishAt: true,
})

const ActivityUpdateSchema = ActivitySchema.pick({
	name: true,
	fine: true,
	description: true,
	startAt: true,
	finishAt: true,
}).partial()

//

export default { ActivitySchema, ActivityCreateSchema, ActivityUpdateSchema }