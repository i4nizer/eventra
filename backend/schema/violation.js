import z from "zod";

//

const ViolationSchema = z.object({
  id: z.number().int(),
  fine: z.coerce.number().int(),
  entryId: z.coerce.number().int(),
  studentId: z.coerce.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const ViolationCreateSchema = ViolationSchema.pick({ fine: true });
const ViolationUpdateSchema = ViolationSchema.pick({ fine: true }).partial();

//

export default {
  ViolationSchema,
  ViolationCreateSchema,
  ViolationUpdateSchema,
};
