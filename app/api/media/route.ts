import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderIdStr = searchParams.get('folderId');
    let folderId: number | null = null;

    if (folderIdStr !== null && folderIdStr !== 'null') {
      folderId = parseInt(folderIdStr, 10);
    }

    // Allow fetching root files (folderId = null) or specific folder files
    const media = await prisma.media.findMany({
      where: folderIdStr === 'all' ? {} : { folderId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, media });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const files = data.getAll('files') as unknown as File[];
    const folderIdStr = data.get('folderId') as string;
    const folderId = folderIdStr && folderIdStr !== 'null' ? parseInt(folderIdStr, 10) : null;

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore
    }

    const uploadedMedia = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
      const filename = `${uniqueSuffix}-${cleanName}`;

      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);

      const url = `/uploads/${filename}`;

      const mediaRecord = await prisma.media.create({
        data: {
          filename: file.name,
          url,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          folderId,
          title: file.name,
        }
      });
      uploadedMedia.push(mediaRecord);
    }

    return NextResponse.json({ success: true, media: uploadedMedia });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
