import z from "zod"

//

const ActivitySectionSchema = z.object({
    id: z.number().int(),
    sectionId: z.number().int(),
    activityId: z.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

//

export default { ActivitySectionSchema }