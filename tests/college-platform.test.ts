import { authService } from "@/services/auth.service";
import { collegeService } from "@/services/college.service";
import { savedCollegeService } from "@/services/savedCollege.service";
import { describe, expect, it } from "vitest";

describe("College Discovery Platform - Core Engine Tests", () => {
  // Test 1: College Search
  it("should search colleges by name (e.g. 'IIT')", async () => {
    const result = await collegeService.getColleges({
      search: "IIT",
      sort: "rating_desc",
      page: 1,
      limit: 10,
    });

    expect(result.colleges.length).toBeGreaterThan(0);
    expect(result.pagination.total).toBeGreaterThan(0);
    const hasIIT = result.colleges.some((c) =>
      c.name.toLowerCase().includes("indian institute of technology") ||
      c.name.toLowerCase().includes("iit") ||
      (c.shortName && c.shortName.toLowerCase().includes("iit"))
    );
    expect(hasIIT).toBe(true);
  });

  it("should search colleges by city (e.g. 'Mumbai')", async () => {
    const result = await collegeService.getColleges({
      city: "Mumbai",
      sort: "rating_desc",
      page: 1,
      limit: 10,
    });

    expect(result.colleges.length).toBeGreaterThan(0);
    result.colleges.forEach((c) => {
      expect(c.city.toLowerCase()).toBe("mumbai");
    });
  });

  it("should search colleges by state (e.g. 'Delhi')", async () => {
    const result = await collegeService.getColleges({
      state: "Delhi",
      sort: "rating_desc",
      page: 1,
      limit: 10,
    });

    expect(result.colleges.length).toBeGreaterThan(0);
    result.colleges.forEach((c) => {
      expect(c.state.toLowerCase()).toBe("delhi");
    });
  });

  // Test 2: College Filtering
  it("should filter colleges by type (e.g. 'Management')", async () => {
    const result = await collegeService.getColleges({
      collegeType: "Management",
      sort: "rating_desc",
      page: 1,
      limit: 10,
    });

    expect(result.colleges.length).toBeGreaterThan(0);
    result.colleges.forEach((c) => {
      expect(c.collegeType).toBe("Management");
    });
  });

  it("should filter colleges by ownership (e.g. 'Public')", async () => {
    const result = await collegeService.getColleges({
      ownership: "Public",
      sort: "rating_desc",
      page: 1,
      limit: 10,
    });

    expect(result.colleges.length).toBeGreaterThan(0);
    result.colleges.forEach((c) => {
      expect(c.ownership).toBe("Public");
    });
  });

  it("should filter colleges by fee range (minFees & maxFees)", async () => {
    const minFees = 50000;
    const maxFees = 300000;
    const result = await collegeService.getColleges({
      minFees,
      maxFees,
      sort: "fees_asc",
      page: 1,
      limit: 10,
    });

    expect(result.colleges.length).toBeGreaterThan(0);
    result.colleges.forEach((c) => {
      expect(c.minFees).toBeGreaterThanOrEqual(minFees);
      expect(c.minFees).toBeLessThanOrEqual(maxFees);
    });
  });

  it("should filter colleges by minimum rating (e.g. rating >= 4.7)", async () => {
    const result = await collegeService.getColleges({
      minRating: 4.7,
      sort: "rating_desc",
      page: 1,
      limit: 10,
    });

    expect(result.colleges.length).toBeGreaterThan(0);
    result.colleges.forEach((c) => {
      expect(c.rating).toBeGreaterThanOrEqual(4.7);
    });
  });

  // Test 3: Pagination
  it("should correctly paginate results with metadata", async () => {
    const page1 = await collegeService.getColleges({
      page: 1,
      limit: 5,
      sort: "rating_desc",
    });

    const page2 = await collegeService.getColleges({
      page: 2,
      limit: 5,
      sort: "rating_desc",
    });

    expect(page1.colleges.length).toBe(5);
    expect(page2.colleges.length).toBe(5);
    expect(page1.pagination.total).toBeGreaterThan(5);
    expect(page1.pagination.page).toBe(1);
    expect(page1.pagination.hasNext).toBe(true);
    expect(page1.pagination.hasPrev).toBe(false);

    expect(page2.pagination.page).toBe(2);
    expect(page2.pagination.hasPrev).toBe(true);

    // Verify disjoint sets across pages
    const page1Ids = new Set(page1.colleges.map((c) => c.id));
    const page2Ids = new Set(page2.colleges.map((c) => c.id));
    for (const id of page2Ids) {
      expect(page1Ids.has(id)).toBe(false);
    }
  });

  // Test 4: College Detail API
  it("should fetch complete college details by slug with relations", async () => {
    const college = await collegeService.getCollegeBySlug("iit-bombay");

    expect(college).toBeDefined();
    expect(college?.slug).toBe("iit-bombay");
    expect(college?.name).toContain("Indian Institute of Technology Bombay");
    expect(college?.courses.length).toBeGreaterThan(0);
    expect(college?.placements.length).toBeGreaterThan(0);
    expect(college?.facilities.length).toBeGreaterThan(0);
    expect(college?.reviews.length).toBeGreaterThan(0);
  });

  it("should return null for non-existent college slug", async () => {
    const college = await collegeService.getCollegeBySlug("non-existent-college-slug-xyz");
    expect(college).toBeNull();
  });

  // Test 5: Authentication Flow (Signup, Login, Duplicates)
  it("should support signup, prevent duplicates, and verify login credentials", async () => {
    const uniqueEmail = `test_engineer_${Date.now()}@example.com`;
    const password = "SecurePassword123";

    // 1. Signup
    const { user, token } = await authService.signup({
      name: "Test Engineer",
      email: uniqueEmail,
      password,
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe(uniqueEmail);
    expect(token).toBeDefined();

    // 2. Prevent duplicate signup
    await expect(
      authService.signup({
        name: "Test Engineer",
        email: uniqueEmail,
        password,
      })
    ).rejects.toThrow("USER_ALREADY_EXISTS");

    // 3. Successful login
    const loginRes = await authService.login({
      email: uniqueEmail,
      password,
    });
    expect(loginRes.user.email).toBe(uniqueEmail);
    expect(loginRes.token).toBeDefined();

    // 4. Failed login with invalid password
    await expect(
      authService.login({
        email: uniqueEmail,
        password: "WrongPassword!",
      })
    ).rejects.toThrow("INVALID_CREDENTIALS");
  });

  // Test 6: Saved College Flow & Duplicate Prevention
  it("should save college, prevent duplicates, list saved, and remove college", async () => {
    const uniqueEmail = `saver_${Date.now()}@example.com`;
    const { user } = await authService.signup({
      name: "Saved Tester",
      email: uniqueEmail,
      password: "Password123",
    });

    const college = await collegeService.getCollegeBySlug("iit-delhi");
    expect(college).toBeDefined();
    const collegeId = college!.id;

    // 1. Save college
    await savedCollegeService.saveCollege(user.id, collegeId);
    let isSaved = await savedCollegeService.isCollegeSaved(user.id, collegeId);
    expect(isSaved).toBe(true);

    // 2. Duplicate save (should be idempotent due to unique constraint / upsert)
    await savedCollegeService.saveCollege(user.id, collegeId);
    const list = await savedCollegeService.getSavedColleges(user.id);
    expect(list.filter((s) => s.college.id === collegeId).length).toBe(1);

    // 3. Remove college
    await savedCollegeService.removeSavedCollege(user.id, collegeId);
    isSaved = await savedCollegeService.isCollegeSaved(user.id, collegeId);
    expect(isSaved).toBe(false);
  });

  // Test 7: Comparison Limit (Max 3 Colleges)
  it("should enforce a maximum of 3 colleges when comparing", async () => {
    const identifiers = ["iit-bombay", "iit-delhi", "iit-madras", "iit-kanpur"];
    const compared = await collegeService.getCollegesForComparison(identifiers);

    // The service must slice to at most 3
    expect(compared.length).toBeLessThanOrEqual(3);
  });
});
