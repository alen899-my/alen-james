import { getConstructionById } from '@/lib/admin/models/constructions.model';
import ConstructionForm from '@/components/admin/constructions/ConstructionForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Construction — Admin' };

export default async function EditConstructionPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const construction = await getConstructionById(parseInt(id));
  if (!construction) notFound();

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5]">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin/constructions"
            className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Edit: {construction.name}</h1>
        </div>
        <p className="text-sm text-[#8b9aaa] ml-8">Update the details for this construction project.</p>
      </div>
      <div className="p-8">
        <ConstructionForm construction={construction} />
      </div>
    </div>
  );
}
