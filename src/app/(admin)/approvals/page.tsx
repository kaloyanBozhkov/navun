import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import { db } from "@/lib/db";
import { getPendingBusinesses } from "@/server/queries/admin/getPendingBusinesses.query";
import { BusinessApprovalPanel } from "@/app/_components/organisms/BusinessApprovalPanel";

export default async function ApprovalsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user || user.role !== "ADMIN") redirect("/");

  const businesses = await getPendingBusinesses();
  const pendingCount = businesses.length;

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Админ панел</h1>
          {pendingCount > 0 && (
            <span className="flex items-center justify-center min-w-[24px] h-6 rounded-full bg-orange-500 px-2 text-xs font-bold text-white">
              {pendingCount}
            </span>
          )}
        </div>
        <BusinessApprovalPanel businesses={businesses} />
      </div>
    </main>
  );
}
