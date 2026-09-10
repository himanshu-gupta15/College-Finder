import prisma from "@/lib/prisma";
import { ReviewCreateInput } from "@/lib/validations/college.schema";
import { reviewRepository } from "@/repositories/review.repository";

export class ReviewService {
  async addReview(
    data: ReviewCreateInput & {
      userId?: string | null;
      reviewerName: string;
      verifiedStudent?: boolean;
    }
  ) {
    const college = await prisma.college.findUnique({
      where: { id: data.collegeId },
      select: { id: true },
    });

    if (!college) {
      throw new Error("COLLEGE_NOT_FOUND");
    }

    return reviewRepository.createReview(data);
  }

  async getCollegeReviews(collegeId: string) {
    return reviewRepository.getReviewsByCollegeId(collegeId);
  }
}

export const reviewService = new ReviewService();
