import { getAllPeople, Person } from '@/lib/admin/models/people.model';
import { getSettings } from '@/lib/admin/models/settings.model';
import Link from 'next/link';
import { Users, Plus, Pencil, Eye, Lock, Globe, Image as ImageIcon } from 'lucide-react';
import DeletePersonButton from './delete-person-button';
import AdminTable from '@/components/admin/common/AdminTable';
import GlobalPeoplePasswordForm from '@/components/admin/people/GlobalPeoplePasswordForm';

export const metadata = { title: 'People — Admin' };

export default async function PeoplePage() {
  const people = await getAllPeople();
  const settings = await getSettings();

  const columns = [
    {
      header: 'Person',
      key: 'name',
      render: (person: Person) => (
        <div className="flex items-center gap-4">
          {person.images && person.images.length > 0 ? (
            <img src={person.images[0]} alt={person.name} className="w-10 h-10 rounded-full object-cover border border-[#e8e2d5]" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center text-[#aab4be]">
              <Users size={18} />
            </div>
          )}
          <div>
            <p className="font-medium text-[#1a1a1a]">{person.name}</p>
            {person.relation && (
              <p className="text-xs text-[#8b9aaa] mt-0.5">{person.relation}</p>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Visibility',
      key: 'is_public',
      render: (person: Person) => (
        <div className="flex items-center gap-1.5">
          {person.is_public ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-600 text-xs font-semibold border border-green-100">
              <Globe size={12} /> Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-xs font-semibold border border-gray-200">
              <Lock size={12} /> Private
            </span>
          )}
          {person.password && (
            <span title="Password Protected" className="text-[#1084a2]">
              <Lock size={14} />
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Media',
      key: 'media',
      render: (person: Person) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-[#3d4852]">{person.images.length} Images</span>
          <span className="text-xs text-[#8b9aaa]">{person.videos.length} Videos</span>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (person: Person) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/people/${person.id}/view`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/people/${person.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeletePersonButton id={person.id} name={person.name} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">People</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage profiles of friends, family, and colleagues</p>
        </div>
        <div className="flex items-center gap-4">
          <GlobalPeoplePasswordForm initialPassword={settings?.people_global_password || null} />
          <div className="w-px h-8 bg-[#e8e2d5]"></div>
          <Link
            href="/admin/people/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Person
          </Link>
        </div>
      </div>

      <div className="p-8">
        <AdminTable 
          columns={columns} 
          data={people} 
          keyField="id" 
          emptyMessage="You haven't added anyone yet."
          emptyIcon={<Users size={40} />}
        />
      </div>
    </div>
  );
}
