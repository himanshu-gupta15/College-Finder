import AdminCollegeForm from "@/components/admin/AdminCollegeForm";
import { collegeService } from "@/services/college.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface EditCollegePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditCollegePageProps): Promise<Metadata> {
  const { id } = await params;
  const college = await collegeService.getCollegeById(id);

  if (!college) {
    return {
      title: "College Not Found - Admin Portal",
    };
  }

  return {
    title: `Edit ${college.name} - Admin Portal | CollegeFinder`,
    description: `Update details, fees, and placements for ${college.name}.`,
  };
}

export default async function EditCollegePage({ params }: EditCollegePageProps) {
  const { id } = await params;
  const college = await collegeService.getCollegeById(id);

  if (!college) {
    notFound();
  }

  // Format data for AdminCollegeForm
  const formattedData = {
    ...college,
    ownership: (college.ownership === "Private" ? "Private" : "Public") as
      | "Public"
      | "Private",
    placements: college.placements?.map((p) => ({
      year: p.year,
      highestPackage: p.highestPackage,
      averagePackage: p.averagePackage,
      medianPackage: p.medianPackage,
      placementRate: p.placementRate,
      topRecruiters: p.topRecruiters,
    })),
    facilities: college.facilities?.map((f) => ({ name: f.name })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminCollegeForm initialData={formattedData} isEdit={true} />
    </div>
  );
}
