import WorkForm from '@/components/admin/works/WorkForm';
import { getAllWorkCategories } from '@/lib/admin/models/work_categories.model';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Add Work — Admin' };

export default async function NewWorkPage() {
  const categories = await getAllWorkCategories();
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
          <h1 className="text-xl font-bold text-[#1a1a1a]">Add New Work</h1>
        </div>
        <p className="text-sm text-[#8b9aaa] ml-8">Create a new portfolio project entry.</p>
      </div>

      <div className="p-8">
        <WorkForm categories={categories} />
      </div>
    </div>
  );
}
