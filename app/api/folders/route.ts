import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const folders = await prisma.mediaFolder.findMany({
      include: {
        children: true
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, folders });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const folder = await prisma.mediaFolder.create({
      data: {
        name,
        parentId: parentId ? parseInt(parentId, 10) : null
      }
    });

    return NextResponse.json({ success: true, folder });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
