import prisma from "@/lib/prisma";
import {
  CollegeCreateInput,
  CollegeQueryParams,
  CollegeUpdateInput,
} from "@/lib/validations/college.schema";
import { collegeRepository } from "@/repositories/college.repository";

export class CollegeService {
  async getColleges(params: CollegeQueryParams) {
    const { total, colleges, page, limit } = await collegeRepository.findColleges(params);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getAdminColleges(params: {
    search?: string;
    collegeType?: string;
    state?: string;
    page?: number;
    limit?: number;
  }) {
    const { total, colleges, page, limit, ownershipGroups } =
      await collegeRepository.findAdminColleges(params);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      ownershipStats: ownershipGroups,
    };
  }

  async getCollegeBySlug(slug: string) {
    return collegeRepository.findBySlug(slug);
  }

  async getCollegeById(id: string) {
    return collegeRepository.findById(id);
  }

  async createCollege(data: CollegeCreateInput) {
    const existing = await prisma.college.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      throw new Error("SLUG_ALREADY_EXISTS");
    }

    return collegeRepository.create(data);
  }

  async updateCollege(id: string, data: CollegeUpdateInput) {
    const existingCollege = await prisma.college.findUnique({
      where: { id },
    });
    if (!existingCollege) {
      throw new Error("COLLEGE_NOT_FOUND");
    }

    if (data.slug !== existingCollege.slug) {
      const slugOccupied = await prisma.college.findFirst({
        where: { slug: data.slug, id: { not: id } },
      });
      if (slugOccupied) {
        throw new Error("SLUG_ALREADY_EXISTS");
      }
    }

    return collegeRepository.update(id, data);
  }

  async deleteCollege(id: string) {
    const existing = await prisma.college.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new Error("COLLEGE_NOT_FOUND");
    }

    return collegeRepository.delete(id);
  }

  async getCollegesForComparison(identifiers: string[]) {
    // Limit to max 3 colleges
    const limitedIdentifiers = identifiers.slice(0, 3);
    return collegeRepository.findMultiple(limitedIdentifiers);
  }

  async getFilterOptions() {
    return collegeRepository.getFilterOptions();
  }
}

export const collegeService = new CollegeService();

