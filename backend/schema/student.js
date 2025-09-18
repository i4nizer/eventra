import z from "zod"

//

const StudentSchema = z.object({
    id: z.number().int(),
    sid: z.string(),
    rfid: z.string(),
    name: z.string().min(1),
    email: z.email(),
    photo: z.string(),
    sectionId: z.number().int(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const StudentCreateSchema = StudentSchema.pick({
    sid: true,
    rfid: true,
    name: true,
    email: true,
    photo: true,
    sectionId: true,
})

const StudentUpdateSchema = StudentSchema.pick({
    id: true,
    sid: true,
    rfid: true,
    name: true,
    email: true,
    photo: true,
})

//

export default { StudentSchema, StudentCreateSchema, StudentUpdateSchema }