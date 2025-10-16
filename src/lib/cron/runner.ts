import cron from 'node-cron';
import { prisma } from '@/lib/db';
import { getAcademicTerm } from '@/lib/utils';

// Set timezone to Africa/Cairo
process.env.TZ = 'Africa/Cairo';

/**
 * Opens EOM nomination window on the 15th of each month
 */
async function openEomNominations() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const term = getAcademicTerm(now);

  const existingCycle = await prisma.eomCycle.findUnique({
    where: { year_month: { year, month } },
  });

  if (!existingCycle) {
    await prisma.eomCycle.create({
      data: {
        year,
        month,
        term,
        status: 'NOMINATING',
        openedAt: now,
      },
    });
    console.log(`[CRON] Opened EOM nominations for ${year}-${month}`);
  } else if (existingCycle.status === 'DRAFT') {
    await prisma.eomCycle.update({
      where: { id: existingCycle.id },
      data: {
        status: 'NOMINATING',
        openedAt: now,
      },
    });
    console.log(`[CRON] Opened EOM nominations for ${year}-${month}`);
  }
}

/**
 * Opens EOM voting window on the 18th of each month
 */
async function openEomVoting() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const cycle = await prisma.eomCycle.findUnique({
    where: { year_month: { year, month } },
  });

  if (cycle && cycle.status === 'NOMINATING') {
    await prisma.eomCycle.update({
      where: { id: cycle.id },
      data: { status: 'VOTING' },
    });
    console.log(`[CRON] Opened EOM voting for ${year}-${month}`);
  }
}

/**
 * Closes EOM voting on the 21st and prepares for winner selection
 */
async function closeEomVoting() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const cycle = await prisma.eomCycle.findUnique({
    where: { year_month: { year, month } },
  });

  if (cycle && cycle.status === 'VOTING') {
    await prisma.eomCycle.update({
      where: { id: cycle.id },
      data: { status: 'CLOSED', closedAt: now },
    });
    console.log(`[CRON] Closed EOM voting for ${year}-${month}`);
  }
}

/**
 * Initialize cron jobs
 */
export function startCronJobs() {
  console.log('[CRON] Starting scheduled jobs (Africa/Cairo timezone)...');

  // Open nominations on the 15th of each month at 00:00
  cron.schedule('0 0 15 * *', openEomNominations, {
    timezone: 'Africa/Cairo',
  });

  // Open voting on the 18th of each month at 00:00
  cron.schedule('0 0 18 * *', openEomVoting, {
    timezone: 'Africa/Cairo',
  });

  // Close voting on the 21st of each month at 00:00
  cron.schedule('0 0 21 * *', closeEomVoting, {
    timezone: 'Africa/Cairo',
  });

  // MRE Round 1: Opens Dec 15
  cron.schedule('0 0 15 12 *', async () => {
    console.log('[CRON] MRE Round 1 opening logic would run here');
  }, {
    timezone: 'Africa/Cairo',
  });

  // MRE Round 2: Opens Mar 15
  cron.schedule('0 0 15 3 *', async () => {
    console.log('[CRON] MRE Round 2 opening logic would run here');
  }, {
    timezone: 'Africa/Cairo',
  });

  console.log('[CRON] Jobs scheduled successfully');
}

// If this file is run directly, start the jobs
if (require.main === module) {
  startCronJobs();
  
  // Keep the process running
  console.log('[CRON] Runner is active. Press Ctrl+C to stop.');
  process.stdin.resume();
}
