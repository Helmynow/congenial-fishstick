import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateCycleStatus } from '@/lib/validators/eom';

// Mock Prisma
vi.mock('@/lib/prisma', () => {
  const mockPrisma = {
    eomCycle: {
      findUnique: vi.fn(),
    },
  };
  
  return {
    prisma: mockPrisma,
  };
});

import { prisma } from '@/lib/prisma';

describe('EOM Validators', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('validateCycleStatus', () => {
    it('should return valid=true when cycle status matches required status', async () => {
      // Arrange
      const cycleId = 'test-cycle-id';
      const requiredStatus = 'NOMINATING';
      
      (prisma.eomCycle.findUnique as any).mockResolvedValue({
        status: requiredStatus,
      });
      
      // Act
      const result = await validateCycleStatus(cycleId, requiredStatus);
      
      // Assert
      expect(prisma.eomCycle.findUnique).toHaveBeenCalledWith({
        where: { id: cycleId },
        select: { status: true },
      });
      
      expect(result).toEqual({ valid: true });
    });

    it('should return valid=false when cycle is not found', async () => {
      // Arrange
      const cycleId = 'non-existent-cycle';
      const requiredStatus = 'NOMINATING';
      
      (prisma.eomCycle.findUnique as any).mockResolvedValue(null);
      
      // Act
      const result = await validateCycleStatus(cycleId, requiredStatus);
      
      // Assert
      expect(result).toEqual({
        valid: false,
        message: 'Cycle not found',
      });
    });

    it('should return valid=false when cycle status does not match required status', async () => {
      // Arrange
      const cycleId = 'test-cycle-id';
      const requiredStatus = 'NOMINATING';
      
      (prisma.eomCycle.findUnique as any).mockResolvedValue({
        status: 'CLOSED',
      });
      
      // Act
      const result = await validateCycleStatus(cycleId, requiredStatus);
      
      // Assert
      expect(result).toEqual({
        valid: false,
        message: 'Cycle is not in NOMINATING status',
      });
    });
  });
});
