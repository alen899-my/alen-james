import { getWhatsNewById } from '@/lib/admin/models/whats_new.model';
import WhatsNewForm from '@/components/admin/whats-new/WhatsNewForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Announcement — Admin' };

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWhatsNewPage({ params }: EditPageProps) {
  const { id } = await params;
  const item = await getWhatsNewById(parseInt(id, 10));

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center gap-3">
        <Link
          href="/admin/whats-new"
          className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Announcement</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Modify the opening pop card info or cover image</p>
        </div>
      </div>
      <div className="p-8">
        <WhatsNewForm item={item} />
      </div>
    </div>
  );
}
