import z from "zod"

//

const AttendanceSchema = z.object({
    id: z.number().int(),
    studentId: z.number().int(),
    activityEntryId: z.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

//

export default { AttendanceSchema }