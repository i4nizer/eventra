import z from "zod"

//

const UserSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const UserCreateSchema = UserSchema.pick({
    name: true,
    email: true,
    password: true,
})

//

export default { UserSchema, UserCreateSchema }