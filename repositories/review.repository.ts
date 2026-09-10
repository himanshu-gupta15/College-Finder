import prisma from "@/lib/prisma";
import { ReviewCreateInput } from "@/lib/validations/college.schema";

export class ReviewRepository {
  async createReview(
    data: ReviewCreateInput & {
      userId?: string | null;
      reviewerName: string;
      verifiedStudent?: boolean;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          collegeId: data.collegeId,
          userId: data.userId || null,
          reviewerName: data.reviewerName,
          rating: data.rating,
          title: data.title,
          pros: data.pros,
          cons: data.cons,
          courseName: data.courseName || null,
          batchYear: data.batchYear || null,
          verifiedStudent: data.verifiedStudent ?? true,
        },
      });

      // Fetch current college stats
      const currentCollege = await tx.college.findUnique({
        where: { id: data.collegeId },
        select: { rating: true, reviewCount: true },
      });

      const currentCount = currentCollege?.reviewCount || 0;
      const currentRating = currentCollege?.rating || data.rating;

      // Running weighted average rating calculation
      const newReviewCount = currentCount + 1;
      const newRating =
        Math.round(
          ((currentRating * currentCount + data.rating) / newReviewCount) * 10
        ) / 10;

      await tx.college.update({
        where: { id: data.collegeId },
        data: {
          rating: newRating,
          reviewCount: newReviewCount,
        },
      });

      return {
        review,
        collegeStats: {
          rating: newRating,
          reviewCount: newReviewCount,
        },
      };
    }, { maxWait: 15000, timeout: 30000 });
  }

  async getReviewsByCollegeId(collegeId: string) {
    return prisma.review.findMany({
      where: { collegeId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const reviewRepository = new ReviewRepository();
