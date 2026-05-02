import DiaryForm from '@/components/admin/diaries/DiaryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Write Diary Entry — Admin' };

export default function NewDiaryPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center gap-3">
        <Link
          href="/admin/diaries"
          className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">New Diary Entry</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Document a new story or incident</p>
        </div>
      </div>
      <div className="p-8">
        <DiaryForm />
      </div>
    </div>
  );
}
