import prisma from "@/lib/prisma";

export class SavedCollegeRepository {
  async findByUserId(userId: string) {
    return prisma.savedCollege.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        college: {
          include: {
            courses: {
              take: 3,
              include: {
                course: true,
              },
            },
            placements: {
              orderBy: { year: "desc" },
              take: 1,
            },
          },
        },
      },
    });
  }

  async isSaved(userId: string, collegeId: string) {
    const record = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });
    return !!record;
  }

  async save(userId: string, collegeId: string) {
    return prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
      create: {
        userId,
        collegeId,
      },
      update: {},
      include: {
        college: true,
      },
    });
  }

  async remove(userId: string, collegeId: string) {
    return prisma.savedCollege.deleteMany({
      where: {
        userId,
        collegeId,
      },
    });
  }
}

export const savedCollegeRepository = new SavedCollegeRepository();
