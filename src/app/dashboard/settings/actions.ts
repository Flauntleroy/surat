"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTemplate(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const format = formData.get("format") as string;
  const prefix = formData.get("prefix") as string;
  const division = formData.get("division") as string;
  const category = formData.get("category") as string;
  const resetYearly = formData.get("resetYearly") === "on";

  if (!name || !format) {
    return { error: "Nama dan format wajib diisi" };
  }

  const count = await prisma.letterTemplate.count();

  await prisma.letterTemplate.create({
    data: {
      name,
      format,
      prefix: prefix || null,
      division: division || null,
      category: category || "Surat Keluar",
      isDefault: count === 0,
      resetYearly,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/letters/new");
  return { success: true };
}

export async function deleteTemplate(templateId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  // Check if template has letters
  const letterCount = await prisma.letter.count({
    where: { templateId },
  });

  if (letterCount > 0) {
    return { error: "Template tidak bisa dihapus karena masih memiliki surat" };
  }

  await prisma.letterTemplate.delete({ where: { id: templateId } });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/letters/new");
  return { success: true };
}

export async function setDefaultTemplate(templateId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  // Remove default from all
  await prisma.letterTemplate.updateMany({
    data: { isDefault: false },
  });

  // Set new default
  await prisma.letterTemplate.update({
    where: { id: templateId },
    data: { isDefault: true },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
