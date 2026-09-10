import AdminCollegeForm from "@/components/admin/AdminCollegeForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New College - Admin Portal | CollegeFinder",
  description: "Register a new college or university profile in the directory.",
};

export default function NewCollegePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminCollegeForm isEdit={false} />
    </div>
  );
}
