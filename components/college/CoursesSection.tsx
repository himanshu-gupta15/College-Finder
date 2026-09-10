import { Award, BookOpen, CheckCircle, Clock, IndianRupee, Users } from "lucide-react";

interface CourseItem {
  id: string;
  annualFees: number;
  eligibility: string;
  seats: number;
  courseType: string;
  course: {
    code: string;
    name: string;
    degree: string;
    stream: string;
    durationYears: number;
  };
}

interface CoursesSectionProps {
  courses: CourseItem[];
}

export default function CoursesSection({ courses }: CoursesSectionProps) {
  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs/yr`;
    }
    return `₹${amount.toLocaleString("en-IN")}/yr`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          <span>Offered Courses & Eligibility Criteria</span>
        </h2>
        <span className="text-xs font-semibold text-slate-500">
          {courses.length} Programs Available
        </span>
      </div>

      <div className="space-y-4">
        {courses.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                    {item.course.degree}
                  </span>
                  <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {item.course.stream}
                  </span>
                  <span className="text-xs text-slate-500">• {item.courseType}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {item.course.name}
                </h3>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Annual Tuition
                </span>
                <span className="text-base font-extrabold text-emerald-700">
                  {formatFees(item.annualFees)}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200/60 pt-3 text-xs">
              <div className="flex items-start gap-2 text-slate-600">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Eligibility: </span>
                  <span>{item.eligibility}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-500 sm:justify-end">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{item.course.durationYears} Years</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>{item.seats} Seats</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
