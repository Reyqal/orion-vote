import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { websiteId } = await request.json();

    if (!websiteId) {
      return NextResponse.json({ error: 'Website ID is required' }, { status: 400 });
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_websiteId: {
          userId: session.user.id,
          websiteId,
        },
      },
    });

    if (existingVote) {
      await prisma.vote.delete({
        where: { id: existingVote.id },
      });

      const voteCount = await prisma.vote.count({
        where: { websiteId },
      });

      return NextResponse.json({ voted: false, voteCount });
    } else {
      await prisma.vote.create({
        data: {
          userId: session.user.id,
          websiteId,
        },
      });

      const voteCount = await prisma.vote.count({
        where: { websiteId },
      });

      return NextResponse.json({ voted: true, voteCount });
    }
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
  }
}
