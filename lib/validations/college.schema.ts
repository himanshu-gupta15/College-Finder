import { z } from "zod";

export const collegeQuerySchema = z.object({
  search: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  collegeType: z.string().trim().optional(),
  ownership: z.enum(["Public", "Private"]).optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  course: z.string().trim().optional(),
  sort: z
    .enum(["rating_desc", "rating_asc", "fees_asc", "fees_desc", "package_desc"])
    .default("rating_desc"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type CollegeQueryParams = z.infer<typeof collegeQuerySchema>;
