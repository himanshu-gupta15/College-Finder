import { reviewCreateSchema } from "@/lib/validations/college.schema";
import { collegeService } from "@/services/college.service";
import { reviewService } from "@/services/review.service";
import { describe, expect, it } from "vitest";

describe("College Rating & Student Reviews Flow", () => {
  // Test 1: Validation
  it("should fail validation if rating is outside 1-5 or pros/cons too short", () => {
    const invalidRating = {
      collegeId: "a0000000-0000-0000-0000-000000000001",
      rating: 6, // Invalid
      title: "Good college",
      pros: "Good", // Too short
      cons: "Bad", // Too short
    };

    const val = reviewCreateSchema.safeParse(invalidRating);
    expect(val.success).toBe(false);
  });

  it("should pass validation with valid rating and pros/cons", () => {
    const valid = {
      collegeId: "a0000000-0000-0000-0000-000000000001",
      rating: 5,
      title: "Exemplary Academic and Innovation Ecosystem",
      pros: "State-of-the-art laboratories, exceptional coding culture, and high average placements.",
      cons: "High academic rigor with intense semester project schedules and strict attendance.",
      reviewerName: "Aakash Verma",
      courseName: "B.Tech Computer Science",
      batchYear: "2024",
    };

    const val = reviewCreateSchema.safeParse(valid);
    expect(val.success).toBe(true);
  });

  // Test 2: Adding a review to a college and checking aggregate rating update
  it("should add a review and automatically recalculate the college rating and count", async () => {
    // Find an existing college
    const college = await collegeService.getCollegeBySlug("iit-delhi");
    expect(college).toBeDefined();
    const originalRating = college!.rating;
    const originalCount = college!.reviewCount;

    const newReview = await reviewService.addReview({
      collegeId: college!.id,
      rating: 5.0,
      title: "Unrivaled tech culture and premier placement opportunities",
      pros: "Top notch research facilities, vibrant hackathons, world class alumni network.",
      cons: "High competitive pressure and heavy assignment workload during midterms.",
      reviewerName: "Pooja Mehta",
      courseName: "B.Tech Electrical",
      batchYear: "2023",
      verifiedStudent: true,
    });

    expect(newReview.review.id).toBeDefined();
    expect(newReview.review.rating).toBe(5.0);
    expect(newReview.collegeStats.reviewCount).toBe(originalCount + 1);

    // Verify college in DB now has the updated rating and count
    const updatedCollege = await collegeService.getCollegeById(college!.id);
    expect(updatedCollege?.reviewCount).toBe(originalCount + 1);
    expect(updatedCollege?.rating).toBeGreaterThanOrEqual(1.0);
    expect(updatedCollege?.rating).toBeLessThanOrEqual(5.0);
  });
});
