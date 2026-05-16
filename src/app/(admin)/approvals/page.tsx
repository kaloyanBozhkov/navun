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

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold">Business Approvals</h1>
        <BusinessApprovalPanel businesses={businesses} />
      </div>
    </main>
  );
}
