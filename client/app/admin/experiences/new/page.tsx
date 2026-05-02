import ExperienceForm from '@/components/admin/experiences/ExperienceForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Add Experience — Admin' };

export default function NewExperiencePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center gap-3">
        <Link
          href="/admin/experiences"
          className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Add New Experience</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Add a new job or role</p>
        </div>
      </div>
      <div className="p-8">
        <ExperienceForm />
      </div>
    </div>
  );
}
