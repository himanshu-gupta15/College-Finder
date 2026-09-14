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

const optionalUrlSchema = z
  .string()
  .trim()
  .transform((val) => {
    if (!val) return val;
    return /^https?:\/\//i.test(val) ? val : `https://${val}`;
  })
  .pipe(z.string().url("Invalid URL format"))
  .optional()
  .or(z.literal(""))
  .nullable();

export const placementSchema = z
  .object({
    year: z.coerce.number().int().min(2000).max(2035).default(() => new Date().getFullYear()),
    highestPackage: z.coerce.number().min(0, "Highest package must be >= 0").default(0),
    averagePackage: z.coerce.number().min(0, "Average package must be >= 0").default(0),
    medianPackage: z.coerce.number().min(0).optional().nullable(),
    placementRate: z.coerce.number().min(0).max(100, "Placement rate must be <= 100%").default(90),
    topRecruiters: z.string().default(""),
  })
  .refine(
    (data) => data.highestPackage === 0 || data.averagePackage <= data.highestPackage,
    {
      message: "Average package cannot exceed Highest package",
      path: ["averagePackage"],
    }
  );

export const collegeCreateSchema = z
  .object({
    name: z.string().trim().min(2, "College name must be at least 2 characters"),
    slug: z
      .string()
      .trim()
      .min(2, "Slug must be at least 2 characters")
      .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    shortName: z.string().trim().optional().nullable(),
    overview: z.string().trim().min(10, "Overview must be at least 10 characters"),
    establishedYear: z.coerce
      .number()
      .int()
      .min(1800, "Established year must be >= 1800")
      .max(new Date().getFullYear() + 1, "Established year cannot be in the future"),
    collegeType: z.string().trim().min(2, "College type is required"),
    ownership: z.enum(["Public", "Private"], {
      errorMap: () => ({ message: "Ownership must be Public or Private" }),
    }),
    affiliation: z.string().trim().optional().nullable(),
    accreditation: z.string().trim().optional().nullable(),
    rating: z.coerce.number().min(1.0).max(5.0).default(4.0),
    reviewCount: z.coerce.number().int().min(0).default(0),
    minFees: z.coerce.number().int().min(0, "Minimum annual fee cannot be negative"),
    maxFees: z.coerce.number().int().min(0, "Maximum annual fee cannot be negative"),
    city: z.string().trim().min(2, "City is required"),
    state: z.string().trim().min(2, "State is required"),
    address: z.string().trim().min(5, "Address must be at least 5 characters"),
    website: optionalUrlSchema,
    logoUrl: optionalUrlSchema,
    bannerUrl: optionalUrlSchema,
    placement: placementSchema.optional().nullable(),
    facilities: z.array(z.string()).default([]),
  })
  .refine((data) => data.minFees <= data.maxFees, {
    message: "Minimum fee cannot exceed Maximum fee",
    path: ["maxFees"],
  });

export const collegeUpdateSchema = collegeCreateSchema;

export type CollegeCreateInput = z.infer<typeof collegeCreateSchema>;
export type CollegeUpdateInput = z.infer<typeof collegeUpdateSchema>;

export const reviewCreateSchema = z.object({
  collegeId: z.string().uuid("Invalid college ID"),
  rating: z.coerce
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),
  pros: z
    .string()
    .trim()
    .min(10, "Pros must be at least 10 characters")
    .max(2000, "Pros cannot exceed 2,000 characters"),
  cons: z
    .string()
    .trim()
    .min(10, "Cons must be at least 10 characters")
    .max(2000, "Cons cannot exceed 2,000 characters"),
  reviewerName: z
    .string()
    .trim()
    .min(2, "Reviewer name must be at least 2 characters")
    .max(60, "Reviewer name cannot exceed 60 characters")
    .optional(),
  courseName: z
    .string()
    .trim()
    .max(100, "Course name cannot exceed 100 characters")
    .optional()
    .nullable(),
  batchYear: z
    .string()
    .trim()
    .regex(
      /^(19[89]\d|20[0-3]\d)$/,
      "Batch year must be a valid 4-digit graduation year between 1980 and 2039"
    )
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;


