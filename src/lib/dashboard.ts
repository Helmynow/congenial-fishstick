import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getUserDashboardData = cache(async (userId: string) => {
  // Get current EOM cycle
  const currentCycle = await prisma.eomCycle.findFirst({
    where: {
      OR: [
        { status: 'NOMINATING' },
        { status: 'VERIFYING' },
        { status: 'VOTING' },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get MRE assignments statistics
  const pendingAssignmentsCount = await prisma.mreAssignment.count({
    where: {
      raterId: userId,
      status: 'PENDING',
    },
  });
  
  const completedAssignmentsCount = await prisma.mreAssignment.count({
    where: {
      raterId: userId,
      status: 'SUBMITTED',
    },
  });

  // Get active staff count
  const activeStaffCount = await prisma.user.count({
    where: {
      NOT: {
        role: 'CEO',
      },
    },
  });

  // Get unread notifications count
  const unreadNotificationsCount = await prisma.notification.count({
    where: {
      userId,
      readAt: null,
    },
  });
  
  // Calculate evaluation completion rate
  const totalAssignments = pendingAssignmentsCount + completedAssignmentsCount;
  const evaluationCompletionRate = totalAssignments > 0
    ? Math.round((completedAssignmentsCount / totalAssignments) * 100)
    : 0;

  // Get upcoming events (placeholder)
  const upcomingEventsCount = await prisma.activityLog.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      }
    }
  });

  return {
    currentCycleTerm: currentCycle?.term || 'No active cycle',
    cycleStatus: currentCycle ? formatCycleStatus(currentCycle.status) : 'N/A',
    completedEvaluations: completedAssignmentsCount,
    totalEvaluations: totalAssignments,
    evaluationCompletionRate,
    activeStaffCount,
    upcomingEventsCount,
    hasNotifications: unreadNotificationsCount > 0,
  };
});

function formatCycleStatus(status: string): string {
  switch (status) {
    case 'NOMINATING': return 'Nomination Phase';
    case 'VERIFYING': return 'Verification Phase';
    case 'VOTING': return 'Voting Phase';
    case 'CLOSED': return 'Cycle Closed';
    default: return 'Draft';
  }
}
