import z from "zod"

//

const PaginationSchema = z.object({
	idarr: z.union([z.string(), z.array(z.string())]).transform((v) => Array.isArray(v) ? v : [v]),
	alpha: z.coerce.date(),
	omega: z.coerce.date(),
	limit: z.coerce.number().int(),
	offset: z.coerce.number().int(),
}).partial()

//

export default { PaginationSchema }
