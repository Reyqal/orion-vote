import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.website.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting website:', error);
    return NextResponse.json({ error: 'Failed to delete website' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, url } = body;

    if (!title || !description || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const website = await prisma.website.update({
      where: { id },
      data: {
        title,
        description,
        url,
        embedUrl: url,
      },
    });

    return NextResponse.json(website);
  } catch (error) {
    console.error('Error updating website:', error);
    return NextResponse.json({ error: 'Failed to update website' }, { status: 500 });
  }
}

