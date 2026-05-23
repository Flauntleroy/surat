import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";
import DashboardShell from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user role from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, image: true, name: true },
  });

  return (
    <>
      <DashboardShell
        userRole={user?.role ?? "MEMBER"}
        userImage={user?.image}
        userName={user?.name}
      >
        {children}
      </DashboardShell>
      <Toaster position="top-right" richColors />
    </>
  );
}
