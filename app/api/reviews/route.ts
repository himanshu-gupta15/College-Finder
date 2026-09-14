import { apiSuccess, handleApiError } from "@/lib/api-response";
import { getSessionUser } from "@/lib/auth";
import { reviewCreateSchema } from "@/lib/validations/college.schema";
import { reviewService } from "@/services/review.service";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getSessionUser(req);

    const validatedData = reviewCreateSchema.parse(body);

    const { reviewerName, ...reviewData } = validatedData;
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
  } catch (error) {
    return handleApiError(error, "Failed to submit review");
  }
}
