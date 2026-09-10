import {
  collegeCreateSchema,
  collegeUpdateSchema,
} from "@/lib/validations/college.schema";
import { collegeService } from "@/services/college.service";
import { describe, expect, it } from "vitest";

describe("Admin College Management - CRUD & Validation Tests", () => {
  const testSlug = `test-polytechnic-${Date.now()}`;

  // Test 1: Validation Schema tests
  it("should fail validation if minimum fee exceeds maximum fee", () => {
    const invalidData = {
      name: "Test Institute of Technology",
      slug: "test-institute",
      overview: "A premier test institute with comprehensive facilities.",
      establishedYear: 2010,
      collegeType: "Engineering",
      ownership: "Public",
      minFees: 300000,
      maxFees: 150000, // Invalid: max < min
      city: "Bengaluru",
      state: "Karnataka",
      address: "123 Electronic City, Bengaluru",
    };

    const result = collegeCreateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.maxFees).toBeDefined();
    }
  });

  it("should fail validation if slug contains uppercase or invalid characters", () => {
    const invalidData = {
      name: "Test Institute",
      slug: "Test_Institute!", // Invalid slug
      overview: "Valid overview text that has sufficient length.",
      establishedYear: 2015,
      collegeType: "Engineering",
      ownership: "Private",
      minFees: 100000,
      maxFees: 200000,
      city: "Pune",
      state: "Maharashtra",
      address: "456 Tech Park, Pune",
    };

    const result = collegeCreateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  // Test 2: College Creation via Service
  let createdCollegeId = "";

  it("should successfully create a new college with placements and facilities", async () => {
    const payload = {
      name: "Apex Institute of Advanced Technology",
      slug: testSlug,
      shortName: "Apex Tech",
      overview:
        "Apex Institute is an autonomous research institution known for cutting-edge AI, robotics, and design disciplines.",
      establishedYear: 2012,
      collegeType: "Engineering",
      ownership: "Public" as const,
      affiliation: "Autonomous / Central",
      accreditation: "NAAC A++",
      rating: 4.6,
      reviewCount: 15,
      minFees: 180000,
      maxFees: 260000,
      city: "Hyderabad",
      state: "Telangana",
      address: "Cyberabad Expressway, HITEC City, Hyderabad",
      website: "https://apex-tech.edu.in",
      placement: {
        year: 2024,
        highestPackage: 62.5,
        averagePackage: 18.2,
        medianPackage: 16.0,
        placementRate: 95.5,
        topRecruiters: "Google, Microsoft, Amazon, Nvidia",
      },
      facilities: ["Wi-Fi Campus", "Central Library", "High-Tech Computer Labs"],
    };

    const validation = collegeCreateSchema.safeParse(payload);
    expect(validation.success).toBe(true);

    const created = await collegeService.createCollege(validation.data!);
    expect(created).toBeDefined();
    expect(created?.id).toBeDefined();
    expect(created?.slug).toBe(testSlug);
    expect(created?.placements.length).toBeGreaterThan(0);
    expect(created?.placements[0].highestPackage).toBe(62.5);
    expect(created?.facilities.length).toBe(3);

    createdCollegeId = created!.id;
  });

  // Test 3: Duplicate slug rejection
  it("should reject creation if slug already exists", async () => {
    const duplicatePayload = {
      name: "Duplicate Institute",
      slug: testSlug, // Same slug
      overview: "Another institute attempting to use an already occupied slug.",
      establishedYear: 2020,
      collegeType: "Engineering",
      ownership: "Private" as const,
      minFees: 100000,
      maxFees: 150000,
      city: "Delhi",
      state: "Delhi",
      address: "Connaught Place, New Delhi",
      facilities: [],
    };

    await expect(
      collegeService.createCollege(collegeCreateSchema.parse(duplicatePayload))
    ).rejects.toThrow("SLUG_ALREADY_EXISTS");
  });

  // Test 4: College Updating via Service
  it("should update college details, fees, and placement packages", async () => {
    expect(createdCollegeId).toBeTruthy();

    const updatePayload = {
      name: "Apex University of Science & Technology",
      slug: testSlug,
      shortName: "Apex Univ",
      overview:
        "Updated overview: Now expanded into a full university campus with state-of-the-art quantum laboratories.",
      establishedYear: 2012,
      collegeType: "Engineering",
      ownership: "Public" as const,
      minFees: 200000, // Updated fees
      maxFees: 300000,
      city: "Hyderabad",
      state: "Telangana",
      address: "Cyberabad Expressway, HITEC City, Hyderabad",
      rating: 4.8,
      reviewCount: 22,
      placement: {
        year: 2024,
        highestPackage: 75.0, // Updated highest package
        averagePackage: 21.0, // Updated avg package
        placementRate: 98.0,
        topRecruiters: "Google, Microsoft, Amazon, Nvidia, Apple",
      },
      facilities: [
        "Wi-Fi Campus",
        "Central Library",
        "High-Tech Computer Labs",
        "Innovation & Incubation Hub",
      ],
    };

    const updated = await collegeService.updateCollege(
      createdCollegeId,
      updatePayload
    );
    expect(updated).toBeDefined();
    expect(updated?.name).toBe("Apex University of Science & Technology");
    expect(updated?.minFees).toBe(200000);
    expect(updated?.maxFees).toBe(300000);
    expect(updated?.placements[0].highestPackage).toBe(75.0);
    expect(updated?.facilities.length).toBe(4);
  });

  // Test 5: Admin Listing with pagination & filters
  it("should list colleges in admin view with search and ownership metrics", async () => {
    const res = await collegeService.getAdminColleges({
      search: "Apex",
      page: 1,
      limit: 10,
    });

    expect(res.colleges.length).toBeGreaterThan(0);
    const apex = res.colleges.find((c) => c.slug === testSlug);
    expect(apex).toBeDefined();
    expect(res.pagination.total).toBeGreaterThan(0);
  });

  // Test 6: Deleting College
  it("should successfully delete the college", async () => {
    expect(createdCollegeId).toBeTruthy();

    await collegeService.deleteCollege(createdCollegeId);

    const check = await collegeService.getCollegeById(createdCollegeId);
    expect(check).toBeNull();
  });
});
