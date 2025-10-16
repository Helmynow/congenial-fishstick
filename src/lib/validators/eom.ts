import { prisma } from '@/lib/prisma';
import { EomCycleStatus } from '@prisma/client';

export async function validateCycleStatus(
  cycleId: string,
  requiredStatus: EomCycleStatus
): Promise<{ valid: boolean; message?: string }> {
  const cycle = await prisma.eomCycle.findUnique({
    where: { id: cycleId },
    select: { status: true },
  });

  if (!cycle) {
    return {
      valid: false,
      message: 'Cycle not found',
    };
  }

  if (cycle.status !== requiredStatus) {
    return {
      valid: false,
      message: `Cycle is not in ${requiredStatus} status`,
    };
  }

  return { valid: true };
}
