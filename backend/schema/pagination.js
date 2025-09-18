import z from "zod";

//

const PaginationSchema = z.object({
	alpha: z.coerce.date().optional(),
	omega: z.coerce.date().optional(),
	limit: z.coerce.number().int().optional(),
	offset: z.coerce.number().int().optional(),
})

//

export default { PaginationSchema }
