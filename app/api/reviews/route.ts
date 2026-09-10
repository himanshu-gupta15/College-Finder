import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionUser } from "@/lib/auth";
import { reviewCreateSchema } from "@/lib/validations/college.schema";
import { reviewService } from "@/services/review.service";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getSessionUser(req);

    const validation = reviewCreateSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid review details",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { reviewerName, ...reviewData } = validation.data;
    const finalReviewerName =
      session?.name || reviewerName || "Verified Student";
    const userId = session?.userId || null;
    const verifiedStudent = Boolean(session);

    const result = await reviewService.addReview({
      ...reviewData,
      reviewerName: finalReviewerName,
      userId,
      verifiedStudent,
    });

    return apiSuccess(result, "Rating & review submitted successfully", 201);
  } catch (error: any) {
    if (error.message === "COLLEGE_NOT_FOUND") {
      return apiError("NOT_FOUND", "College not found", 404);
    }
    console.error("Error in POST /api/reviews:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to submit review", 500);
  }
}
