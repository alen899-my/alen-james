import WorkForm from '@/components/admin/works/WorkForm';
import { getWorkById } from '@/lib/admin/models/works.model';
import { getAllWorkCategories } from '@/lib/admin/models/work_categories.model';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Work — Admin' };

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const [work, categories] = await Promise.all([
    getWorkById(Number(resolvedParams.id)),
    getAllWorkCategories(),
  ]);

  if (!work) {
    notFound();
  }

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5]">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/admin/works"
            className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Work: {work.title}</h1>
        </div>
        <p className="text-sm text-[#8b9aaa] ml-8">Update project details and assets.</p>
      </div>

      <div className="p-8">
        <WorkForm work={work} categories={categories} />
      </div>
    </div>
  );
}
