import RegretForm from '@/components/admin/regrets/RegretForm';
import { getRegretById } from '@/lib/admin/models/regrets.model';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Regret — Admin' };

export default async function EditRegretPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const regret = await getRegretById(Number(resolvedParams.id));

  if (!regret) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center gap-3">
        <Link
          href="/admin/regrets"
          className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Regret</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Update details for this entry</p>
        </div>
      </div>
      <div className="p-8">
        <RegretForm regret={regret} />
      </div>
    </div>
  );
}
