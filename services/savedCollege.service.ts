import { collegeRepository } from "@/repositories/college.repository";
import { savedCollegeRepository } from "@/repositories/savedCollege.repository";

export class SavedCollegeService {
  async getSavedColleges(userId: string) {
    const saved = await savedCollegeRepository.findByUserId(userId);
    return saved.map((s) => ({
      savedAt: s.createdAt,
      college: s.college,
    }));
  }

  async saveCollege(userId: string, collegeId: string) {
    const college = await collegeRepository.findById(collegeId);
    if (!college) {
      throw new Error("COLLEGE_NOT_FOUND");
    }

    return savedCollegeRepository.save(userId, collegeId);
  }

  async removeSavedCollege(userId: string, collegeId: string) {
    return savedCollegeRepository.remove(userId, collegeId);
  }

  async isCollegeSaved(userId: string, collegeId: string) {
    return savedCollegeRepository.isSaved(userId, collegeId);
  }
}

export const savedCollegeService = new SavedCollegeService();
