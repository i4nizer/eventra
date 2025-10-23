import z from "zod"

//

const PaginationSchema = z.object({
	alpha: z.coerce.date(),
	omega: z.coerce.date(),
	limit: z.coerce.number().int(),
	offset: z.coerce.number().int(),
}).partial()

//

export default { PaginationSchema }
