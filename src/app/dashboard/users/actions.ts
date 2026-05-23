"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function changeUserRole(userId: string, newRole: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  // Verify current user is admin
  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (currentUser?.role !== "ADMIN") {
    return { error: "Hanya admin yang bisa mengubah role" };
  }

  // Can't change own role
  if (userId === session.user.id) {
    return { error: "Tidak bisa mengubah role sendiri" };
  }

  if (newRole !== "ADMIN" && newRole !== "MEMBER") {
    return { error: "Role tidak valid" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole as "ADMIN" | "MEMBER" },
  });

  revalidatePath("/dashboard/users");
  return { success: true };
}
