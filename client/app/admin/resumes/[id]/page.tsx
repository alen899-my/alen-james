import ResumeForm from '@/components/admin/resumes/ResumeForm';
import { getResumeById } from '@/lib/admin/models/resumes.model';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Resume — Admin' };

export default async function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const resume = await getResumeById(Number(resolvedParams.id));

  if (!resume) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center gap-3">
        <Link
          href="/admin/resumes"
          className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Resume</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Update {resume.name}</p>
        </div>
      </div>
      <div className="p-8">
        <ResumeForm resume={resume} />
      </div>
    </div>
  );
}
