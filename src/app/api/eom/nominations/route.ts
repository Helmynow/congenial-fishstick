import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { validateCycleStatus } from '@/lib/validators/eom';

const nominationSchema = z.object({
  cycleId: z.string().cuid(),
  categoryId: z.string().cuid(),
  nomineeId: z.string().cuid(),
  reason: z.string().min(10).max(1000),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = nominationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { cycleId, categoryId, nomineeId, reason } = validationResult.data;
    
    // Verify cycle is in NOMINATING status
    const cycleStatus = await validateCycleStatus(cycleId, 'NOMINATING');
    if (!cycleStatus.valid) {
      return NextResponse.json(
        { error: cycleStatus.message },
        { status: 400 }
      );
    }
    
    // Business logic validations
    if (nomineeId === user.id) {
      return NextResponse.json(
        { error: 'You cannot nominate yourself' },
        { status: 400 }
      );
    }
    
    // Check for existing nominations
    const existingNomination = await prisma.eomNomination.findFirst({
      where: {
        cycleId,
        categoryId,
        nominatorId: user.id,
      },
    });
    
    if (existingNomination) {
      return NextResponse.json(
        { error: 'You have already submitted a nomination for this category' },
        { status: 400 }
      );
    }
    
    // Create nomination with transaction
    const nomination = await prisma.$transaction(async (tx) => {
      // Create the nomination
      const nom = await tx.eomNomination.create({
        data: {
          cycleId,
          categoryId,
          nomineeId,
          nominatorId: user.id,
          reason,
        },
        include: {
          nominee: {
            select: { name: true, email: true },
          },
          category: { select: { name: true } },
        },
      });
      
      // Log activity
      await tx.activityLog.create({
        data: {
          actorId: user.id,
          action: 'CREATE_EOM_NOMINATION',
          meta: {
            nominationId: nom.id,
            categoryName: nom.category.name,
            nomineeName: nom.nominee.name,
          },
        },
      });
      
      // Create notification
      await tx.notification.create({
        data: {
          userId: nomineeId,
          type: 'EOM_NOMINATION_RECEIVED',
          payload: {
            nominationId: nom.id,
            categoryName: nom.category.name,
            nominatorName: user.name || user.email,
          },
        },
      });
      
      return nom;
    });
    
    return NextResponse.json(
      { 
        message: 'Nomination submitted successfully', 
        nomination: {
          id: nomination.id,
          categoryName: nomination.category.name,
          nomineeName: nomination.nominee.name,
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating nomination:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create nomination' },
      { status: 500 }
    );
  }
}
