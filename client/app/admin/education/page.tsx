import { getAllEducation, Education } from '@/lib/admin/models/education.model';
import Link from 'next/link';
import { BookOpen, Plus, Pencil, Eye, GraduationCap } from 'lucide-react';
import DeleteEducationButton from './delete-education-button';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: 'Education — Admin' };

export default async function EducationPage() {
  const educationList = await getAllEducation();

  const columns = [
    {
      header: 'Institution',
      key: 'name',
      render: (edu: Education) => (
        <div className="flex items-center gap-4">
          {edu.school_photo ? (
            <img src={edu.school_photo} alt={edu.name} className="w-12 h-12 rounded-lg object-cover border border-[#e8e2d5]" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center text-[#aab4be]">
              <GraduationCap size={20} />
            </div>
          )}
          <div>
            <p className="font-medium text-[#1a1a1a]">{edu.name}</p>
            {edu.studied && <p className="text-xs text-[#8b9aaa] mt-0.5">{edu.studied}</p>}
          </div>
        </div>
      )
    },
    {
      header: 'Years',
      key: 'years',
      render: (edu: Education) => (
        <span className="text-sm text-[#3d4852]">
          {edu.year_from} {edu.year_to ? `- ${edu.year_to}` : ''}
        </span>
      )
    },
    {
      header: 'Location',
      key: 'school_location',
      render: (edu: Education) => <span className="text-sm text-[#3d4852]">{edu.school_location || '-'}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (edu: Education) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/education/${edu.id}/view`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/education/${edu.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeleteEducationButton id={edu.id} name={edu.name} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Education</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage your educational background</p>
        </div>
        <Link
          href="/admin/education/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Education
        </Link>
      </div>

      <div className="p-8">
        <AdminTable 
          columns={columns} 
          data={educationList} 
          keyField="id" 
          emptyMessage="You haven't added any education details yet."
          emptyIcon={<BookOpen size={40} />}
        />
      </div>
    </div>
  );
}
