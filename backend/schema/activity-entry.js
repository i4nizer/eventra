import z from "zod"

//

const ActivityEntrySchema = z.object({
    id: z.number().int(),
    name: z.string().default(""),
    startAt: z.coerce.date(),
    finishAt: z.coerce.date(),
    activityId: z.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const ActivityEntryCreateSchema = ActivityEntrySchema.pick({
    name: true,
    startAt: true,
    finishAt: true,
})

const ActivityEntryUpdateSchema = ActivityEntrySchema.pick({
	name: true,
	startAt: true,
	finishAt: true,
}).partial()

//

export default { ActivityEntrySchema, ActivityEntryCreateSchema, ActivityEntryUpdateSchema }