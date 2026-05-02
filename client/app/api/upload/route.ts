import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getAdminSession } from '@/lib/auth';
import crypto from 'crypto';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY || '',
  },
});

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID || !process.env.CLOUDFLARE_R2_ACCESS_KEY || !process.env.CLOUDFLARE_R2_SECRET_KEY || !process.env.CLOUDFLARE_R2_BUCKET || !process.env.CLOUDFLARE_R2_PUBLIC_URL) {
      return NextResponse.json({ error: 'R2 configuration is missing in environment variables' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL.replace(/\/$/, '')}/${uniqueFileName}`;

    return NextResponse.json({ url: publicUrl, success: true });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
