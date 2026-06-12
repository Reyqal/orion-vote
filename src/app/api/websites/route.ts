import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const websites = await prisma.website.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { votes: true },
        },
        votes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    });

    const result = websites.map((w) => ({
      id: w.id,
      title: w.title,
      description: w.description,
      url: w.url,
      embedUrl: w.embedUrl,
      createdAt: w.createdAt,
      voteCount: w._count.votes,
      hasVoted: userId ? (w.votes as any[]).length > 0 : false,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching websites:', error);
    return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, url } = body;

    if (!title || !description || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const website = await prisma.website.create({
      data: {
        title,
        description,
        url,
        embedUrl: url,
      },
    });

    return NextResponse.json(website, { status: 201 });
  } catch (error) {
    console.error('Error creating website:', error);
    return NextResponse.json({ error: 'Failed to create website' }, { status: 500 });
  }
}
