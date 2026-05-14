import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    const body = await request.json();

    const media = await prisma.media.update({
      where: { id },
      data: {
        altText: body.altText !== undefined ? body.altText : undefined,
        title: body.title !== undefined ? body.title : undefined,
        caption: body.caption !== undefined ? body.caption : undefined,
        folderId: body.folderId !== undefined ? body.folderId : undefined
      }
    });

    return NextResponse.json({ success: true, media });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
       return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
    }

    // Attempt to delete physical file
    try {
      const filePath = path.join(process.cwd(), 'public', media.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch(err) {
      console.warn("Could not delete physical file:", err);
    }

    await prisma.media.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
