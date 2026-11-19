import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCompanyInsights } from "@/actions/company";
import ReportsClient from "@/components/admin/ReportsClient";
import { canViewCompanyReports } from "@/lib/rbac";

export default async function AdminReportsPage() {
  const session = await auth();
  if (!canViewCompanyReports(session?.user?.role)) {
    redirect("/admin/dashboard");
  }

  const result = await getCompanyInsights();
  if (!result.ok) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-700">
        {result.error}
      </div>
    );
  }

  return <ReportsClient insights={result.data} />;
}
