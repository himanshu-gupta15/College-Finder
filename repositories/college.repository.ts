import prisma from "@/lib/prisma";
import {
  CollegeCreateInput,
  CollegeQueryParams,
  CollegeUpdateInput,
} from "@/lib/validations/college.schema";
import { Prisma } from "@prisma/client";

export class CollegeRepository {
  async findColleges(params: CollegeQueryParams) {
    const {
      search,
      city,
      state,
      collegeType,
      ownership,
      minFees,
      maxFees,
      minRating,
      course,
      sort,
      page,
      limit,
    } = params;

    const where: Prisma.CollegeWhereInput = {};

    // Search query matches name, city, state, or shortName
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortName: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
      ];
    }

    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }

    if (state) {
      where.state = { equals: state, mode: "insensitive" };
    }

    if (collegeType) {
      where.collegeType = { equals: collegeType, mode: "insensitive" };
    }

    if (ownership) {
      where.ownership = ownership;
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    if (minFees !== undefined || maxFees !== undefined) {
      where.minFees = {};
      if (minFees !== undefined) {
        where.minFees.gte = minFees;
      }
      if (maxFees !== undefined) {
        where.minFees.lte = maxFees;
      }
    }

    if (course) {
      where.courses = {
        some: {
          course: {
            OR: [
              { name: { contains: course, mode: "insensitive" } },
              { code: { contains: course, mode: "insensitive" } },
              { degree: { contains: course, mode: "insensitive" } },
            ],
          },
        },
      };
    }

    // Determine sorting
    let orderBy: Prisma.CollegeOrderByWithRelationInput[] = [];
    switch (sort) {
      case "fees_asc":
        orderBy = [{ minFees: "asc" }, { rating: "desc" }];
        break;
      case "fees_desc":
        orderBy = [{ maxFees: "desc" }, { rating: "desc" }];
        break;
      case "rating_asc":
        orderBy = [{ rating: "asc" }, { name: "asc" }];
        break;
      case "package_desc":
        orderBy = [{ rating: "desc" }, { minFees: "asc" }];
        break;
      case "rating_desc":
      default:
        orderBy = [{ rating: "desc" }, { reviewCount: "desc" }];
        break;
    }

    const skip = (page - 1) * limit;

    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: {
            take: 4,
            include: {
              course: true,
            },
          },
          placements: {
            orderBy: { year: "desc" },
            take: 1,
          },
          _count: {
            select: {
              courses: true,
              reviews: true,
            },
          },
        },
      }),
    ]);

    return { total, colleges, page, limit };
  }

  async findBySlug(slug: string) {
    return prisma.college.findUnique({
      where: { slug },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
        placements: {
          orderBy: { year: "desc" },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        facilities: true,
        _count: {
          select: {
            savedBy: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.college.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
        placements: {
          orderBy: { year: "desc" },
        },
        facilities: true,
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            savedBy: true,
          },
        },
      },
    });
  }

  async findMultiple(identifiers: string[]) {
    return prisma.college.findMany({
      where: {
        OR: [
          { id: { in: identifiers } },
          { slug: { in: identifiers } },
        ],
      },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
        placements: {
          orderBy: { year: "desc" },
          take: 1,
        },
        facilities: true,
        _count: {
          select: {
            reviews: true,
            courses: true,
          },
        },
      },
    });
  }

  async create(data: CollegeCreateInput) {
    const { placement, facilities, ...collegeFields } = data;

    return prisma.$transaction(async (tx) => {
      const college = await tx.college.create({
        data: {
          ...collegeFields,
          shortName: collegeFields.shortName || null,
          affiliation: collegeFields.affiliation || null,
          accreditation: collegeFields.accreditation || null,
          website: collegeFields.website || null,
          logoUrl: collegeFields.logoUrl || null,
          bannerUrl: collegeFields.bannerUrl || null,
        },
      });

      if (placement) {
        await tx.placement.create({
          data: {
            collegeId: college.id,
            year: placement.year,
            highestPackage: placement.highestPackage,
            averagePackage: placement.averagePackage,
            medianPackage: placement.medianPackage || null,
            placementRate: placement.placementRate,
            topRecruiters: placement.topRecruiters,
          },
        });
      }

      if (facilities && facilities.length > 0) {
        await tx.facility.createMany({
          data: facilities.map((name) => ({
            collegeId: college.id,
            name,
          })),
        });
      }

      return tx.college.findUnique({
        where: { id: college.id },
        include: {
          placements: { orderBy: { year: "desc" } },
          facilities: true,
          courses: { include: { course: true } },
        },
      });
    }, { maxWait: 15000, timeout: 30000 });
  }

  async update(id: string, data: CollegeUpdateInput) {
    const { placement, facilities, ...collegeFields } = data;

    return prisma.$transaction(async (tx) => {
      await tx.college.update({
        where: { id },
        data: {
          ...collegeFields,
          shortName: collegeFields.shortName || null,
          affiliation: collegeFields.affiliation || null,
          accreditation: collegeFields.accreditation || null,
          website: collegeFields.website || null,
          logoUrl: collegeFields.logoUrl || null,
          bannerUrl: collegeFields.bannerUrl || null,
        },
      });

      if (placement) {
        const existingPlacement = await tx.placement.findFirst({
          where: { collegeId: id, year: placement.year },
        });

        if (existingPlacement) {
          await tx.placement.update({
            where: { id: existingPlacement.id },
            data: {
              highestPackage: placement.highestPackage,
              averagePackage: placement.averagePackage,
              medianPackage: placement.medianPackage || null,
              placementRate: placement.placementRate,
              topRecruiters: placement.topRecruiters,
            },
          });
        } else {
          await tx.placement.create({
            data: {
              collegeId: id,
              year: placement.year,
              highestPackage: placement.highestPackage,
              averagePackage: placement.averagePackage,
              medianPackage: placement.medianPackage || null,
              placementRate: placement.placementRate,
              topRecruiters: placement.topRecruiters,
            },
          });
        }
      }

      if (facilities) {
        await tx.facility.deleteMany({
          where: { collegeId: id },
        });
        if (facilities.length > 0) {
          await tx.facility.createMany({
            data: facilities.map((name) => ({
              collegeId: id,
              name,
            })),
          });
        }
      }

      return tx.college.findUnique({
        where: { id },
        include: {
          placements: { orderBy: { year: "desc" } },
          facilities: true,
          courses: { include: { course: true } },
        },
      });
    }, { maxWait: 15000, timeout: 30000 });
  }

  async delete(id: string) {
    return prisma.college.delete({
      where: { id },
    });
  }

  async findAdminColleges(params: {
    search?: string;
    collegeType?: string;
    state?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, collegeType, state, page = 1, limit = 15 } = params;
    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortName: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
      ];
    }

    if (collegeType) {
      where.collegeType = { equals: collegeType, mode: "insensitive" };
    }

    if (state) {
      where.state = { equals: state, mode: "insensitive" };
    }

    const skip = (page - 1) * limit;

    const [total, colleges, ownershipGroups] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: {
          placements: {
            orderBy: { year: "desc" },
            take: 1,
          },
          facilities: true,
          _count: {
            select: {
              courses: true,
              reviews: true,
              savedBy: true,
            },
          },
        },
      }),
      prisma.college.groupBy({
        by: ["ownership"],
        _count: { id: true },
      }),
    ]);

    return { total, colleges, page, limit, ownershipGroups };
  }

  async getFilterOptions() {
    const [states, cities, types] = await Promise.all([
      prisma.college.findMany({
        select: { state: true },
        distinct: ["state"],
        orderBy: { state: "asc" },
      }),
      prisma.college.findMany({
        select: { city: true },
        distinct: ["city"],
        orderBy: { city: "asc" },
      }),
      prisma.college.findMany({
        select: { collegeType: true },
        distinct: ["collegeType"],
        orderBy: { collegeType: "asc" },
      }),
    ]);

    return {
      states: states.map((s) => s.state),
      cities: cities.map((c) => c.city),
      collegeTypes: types.map((t) => t.collegeType),
    };
  }
}

export const collegeRepository = new CollegeRepository();
