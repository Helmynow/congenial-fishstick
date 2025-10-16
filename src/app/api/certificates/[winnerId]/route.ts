import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/db';
import { generateCertificate } from '@/lib/pdf/certificate';

export async function GET(
  request: NextRequest,
  { params }: { params: { winnerId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const winner = await prisma.eomWinner.findUnique({
      where: { id: params.winnerId },
      include: {
        winner: true,
        category: true,
        cycle: true,
      },
    });

    if (!winner) {
      return NextResponse.json({ error: 'Winner not found' }, { status: 404 });
    }

    // Generate certificate
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const pdfBytes = await generateCertificate({
      recipientName: winner.winner.name || winner.winner.email,
      category: winner.category.name,
      month: monthNames[winner.cycle.month - 1],
      year: winner.cycle.year,
      date: winner.announcedOn || winner.createdAt,
    });

    // Return PDF
    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${winner.winner.name?.replace(/\s+/g, '-')}-${winner.cycle.year}-${winner.cycle.month}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
