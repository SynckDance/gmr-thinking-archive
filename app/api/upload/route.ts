import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// POST /api/upload - Upload video to storage
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const sessionId = formData.get('sessionId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: MP4, WebM, MOV' },
        { status: 400 }
      );
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 500MB' },
        { status: 400 }
      );
    }

    // In production, upload to Vercel Blob
    // For now, return a placeholder URL
    // To enable real uploads, install @vercel/blob and add BLOB_READ_WRITE_TOKEN

    /*
    import { put } from '@vercel/blob';

    const filename = `${sessionId}/${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      url: blob.url,
      filename: blob.pathname,
    });
    */

    // Placeholder response
    const placeholderUrl = `/uploads/${sessionId}/${Date.now()}-${file.name}`;

    return NextResponse.json({
      url: placeholderUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      message: 'Upload endpoint ready. Configure Vercel Blob for production.',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
