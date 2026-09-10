import { CollegeQueryParams } from "@/lib/validations/college.schema";
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

  async getCollegeBySlug(slug: string) {
    return collegeRepository.findBySlug(slug);
  }

  async getCollegeById(id: string) {
    return collegeRepository.findById(id);
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
