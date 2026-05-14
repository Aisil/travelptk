import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    const body = await request.json();
    const { name, parentId } = body;

    const folder = await prisma.mediaFolder.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        parentId: parentId !== undefined ? parentId : undefined
      }
    });

    return NextResponse.json({ success: true, folder });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    // Prisma won't let you delete if there are foreign key constraints,
    // so in a real app we either delete recursively or set to null.
    // For this implementation we'll try to delete directly.
    await prisma.mediaFolder.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
