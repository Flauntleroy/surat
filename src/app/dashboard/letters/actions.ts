"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateLetterNumber } from "@/lib/letter-utils";
import { logActivity } from "@/lib/activity-log";

export async function createLetterWithAttachments(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const templateId = formData.get("templateId") as string;
  const subject = formData.get("subject") as string;
  const recipient = formData.get("recipient") as string;
  const notes = formData.get("notes") as string;
  const letterDate = formData.get("letterDate") as string;
  const category = formData.get("category") as string;
  const attachmentFiles = formData.getAll("attachments") as File[];

  if (!templateId || !subject) {
    throw new Error("Template dan perihal wajib diisi");
  }

  const template = await prisma.letterTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error("Template tidak ditemukan");
  }

  const date = letterDate ? new Date(letterDate) : new Date();
  const currentYear = date.getFullYear();

  // Get next number - with yearly reset support
  let lastLetter;
  if (template.resetYearly) {
    lastLetter = await prisma.letter.findFirst({
      where: { templateId, letterYear: currentYear },
      orderBy: { number: "desc" },
    });
  } else {
    lastLetter = await prisma.letter.findFirst({
      where: { templateId },
      orderBy: { number: "desc" },
    });
  }

  const nextNumber = (lastLetter?.number ?? 0) + 1;
  const generatedNo = generateLetterNumber(template.format, {
    number: nextNumber,
    prefix: template.prefix,
    division: template.division,
    date,
  });

  const letter = await prisma.letter.create({
    data: {
      number: nextNumber,
      letterYear: currentYear,
      generatedNo,
      subject,
      recipient: recipient || null,
      notes: notes || null,
      category: category || template.category,
      templateId,
      userId: session.user.id,
      letterDate: date,
    },
  });

  // Handle attachments
  for (const file of attachmentFiles) {
    if (!file || file.size === 0) continue;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    await prisma.attachment.create({
      data: {
        letterId: letter.id,
        fileName: file.name,
        fileUrl: dataUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
    });
  }

  await logActivity({
    userId: session.user.id,
    action: "CREATE",
    entity: "LETTER",
    entityId: letter.id,
    description: `Membuat surat ${generatedNo} - ${subject}`,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/letters");
  redirect("/dashboard/letters");
}

export async function createLetter(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const templateId = formData.get("templateId") as string;
  const subject = formData.get("subject") as string;
  const recipient = formData.get("recipient") as string;
  const notes = formData.get("notes") as string;
  const letterDate = formData.get("letterDate") as string;

  if (!templateId || !subject) {
    throw new Error("Template dan perihal wajib diisi");
  }

  const template = await prisma.letterTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error("Template tidak ditemukan");
  }

  const date = letterDate ? new Date(letterDate) : new Date();
  const currentYear = date.getFullYear();

  // Get next number - with yearly reset support
  let lastLetter;
  if (template.resetYearly) {
    lastLetter = await prisma.letter.findFirst({
      where: { templateId, letterYear: currentYear },
      orderBy: { number: "desc" },
    });
  } else {
    lastLetter = await prisma.letter.findFirst({
      where: { templateId },
      orderBy: { number: "desc" },
    });
  }

  const nextNumber = (lastLetter?.number ?? 0) + 1;
  const generatedNo = generateLetterNumber(template.format, {
    number: nextNumber,
    prefix: template.prefix,
    division: template.division,
    date,
  });

  const letter = await prisma.letter.create({
    data: {
      number: nextNumber,
      letterYear: currentYear,
      generatedNo,
      subject,
      recipient: recipient || null,
      notes: notes || null,
      category: template.category,
      templateId,
      userId: session.user.id,
      letterDate: date,
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "CREATE",
    entity: "LETTER",
    entityId: letter.id,
    description: `Membuat surat ${generatedNo} - ${subject}`,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/letters");
  redirect("/dashboard/letters");
}

export async function updateLetter(letterId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const subject = formData.get("subject") as string;
  const recipient = formData.get("recipient") as string;
  const notes = formData.get("notes") as string;
  const letterDate = formData.get("letterDate") as string;

  if (!subject) {
    return { error: "Perihal wajib diisi" };
  }

  const letter = await prisma.letter.findUnique({ where: { id: letterId } });
  if (!letter) return { error: "Surat tidak ditemukan" };

  // Check permission: owner or admin
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (letter.userId !== session.user.id && user?.role !== "ADMIN") {
    return { error: "Tidak memiliki akses" };
  }

  await prisma.letter.update({
    where: { id: letterId },
    data: {
      subject,
      recipient: recipient || null,
      notes: notes || null,
      letterDate: letterDate ? new Date(letterDate) : undefined,
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "LETTER",
    entityId: letterId,
    description: `Mengubah surat ${letter.generatedNo} - ${subject}`,
  });

  revalidatePath("/dashboard/letters");
  return { success: true };
}

export async function deleteLetter(letterId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const letter = await prisma.letter.findUnique({ where: { id: letterId } });
  if (!letter) return { error: "Surat tidak ditemukan" };

  // Check permission: owner or admin
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (letter.userId !== session.user.id && user?.role !== "ADMIN") {
    return { error: "Tidak memiliki akses" };
  }

  await prisma.letter.delete({ where: { id: letterId } });

  await logActivity({
    userId: session.user.id,
    action: "DELETE",
    entity: "LETTER",
    entityId: letterId,
    description: `Menghapus surat ${letter.generatedNo} - ${letter.subject}`,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/letters");
  return { success: true };
}

export async function uploadAttachment(letterId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("file") as File;
  if (!file) return { error: "File tidak ditemukan" };

  // For now, store as base64 data URL (in production, use cloud storage like S3/Cloudinary)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  await prisma.attachment.create({
    data: {
      letterId,
      fileName: file.name,
      fileUrl: dataUrl,
      fileSize: file.size,
      mimeType: file.type,
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "LETTER",
    entityId: letterId,
    description: `Menambahkan lampiran "${file.name}"`,
  });

  revalidatePath(`/dashboard/letters/${letterId}`);
  return { success: true };
}

export async function deleteAttachment(attachmentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    include: { letter: true },
  });
  if (!attachment) return { error: "Lampiran tidak ditemukan" };

  await prisma.attachment.delete({ where: { id: attachmentId } });

  await logActivity({
    userId: session.user.id,
    action: "DELETE",
    entity: "LETTER",
    entityId: attachment.letterId,
    description: `Menghapus lampiran "${attachment.fileName}"`,
  });

  revalidatePath(`/dashboard/letters/${attachment.letterId}`);
  return { success: true };
}
