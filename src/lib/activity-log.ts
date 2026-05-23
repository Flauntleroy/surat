import { prisma } from "@/lib/prisma";

type LogAction = "CREATE" | "UPDATE" | "DELETE";
type LogEntity = "LETTER" | "TEMPLATE";

interface LogParams {
  userId: string;
  action: LogAction;
  entity: LogEntity;
  entityId?: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity(params: LogParams) {
  await prisma.activityLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      description: params.description,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    },
  });
}
