import { auth } from "@/auth";
import { getAdminLaptops, getDashboardStats } from "@/actions/admin";
import { getCompanyInsights } from "@/actions/company";
import DashboardClient from "@/components/admin/DashboardClient";
import CompanyOverview from "@/components/admin/CompanyOverview";
import { canDeleteLaptops, isCompanyOwner } from "@/lib/rbac";

export default async function AdminDashboardPage() {
  const session = await auth();
  const role = session?.user?.role;
  const ownerView = isCompanyOwner(role);

  const [statsResult, laptopsResult, insightsResult] = await Promise.all([
    getDashboardStats(),
    getAdminLaptops({ stock: "ALL" }),
    ownerView ? getCompanyInsights() : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      {ownerView && insightsResult?.ok && (
        <CompanyOverview
          insights={insightsResult.data}
          ownerName={session?.user?.name}
        />
      )}

      <DashboardClient
        stats={
          statsResult.ok
            ? statsResult.data
            : {
                totalActive: 0,
                soldOut: 0,
                totalViews: 0,
                totalClicks: 0,
                limited: 0,
              }
        }
        initialLaptops={laptopsResult.ok ? laptopsResult.data : []}
        canDelete={canDeleteLaptops(role)}
        title={ownerView ? "Inventory Control" : "Dashboard"}
        subtitle={
          ownerView
            ? "Simamia stock ya kampuni, bei, na status ya kila laptop"
            : "Inventory overview & laptop management"
        }
      />
    </div>
  );
}
