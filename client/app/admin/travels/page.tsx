import { getAllTravels, Travel } from '@/lib/admin/models/travels.model';
import { getSettings } from '@/lib/admin/models/settings.model';
import Link from 'next/link';
import { MapPin, Plus, Pencil, Eye, Lock, Globe, Image as ImageIcon } from 'lucide-react';
import DeleteTravelButton from './delete-travel-button';
import AdminTable from '@/components/admin/common/AdminTable';
import GlobalTravelPasswordForm from '@/components/admin/travels/GlobalTravelPasswordForm';

export const metadata = { title: 'Travel Log — Admin' };

export default async function TravelsPage() {
  const travels = await getAllTravels();
  const settings = await getSettings();

  const columns = [
    {
      header: 'Location',
      key: 'location',
      render: (travel: Travel) => (
        <div className="flex items-center gap-4">
          {travel.images && travel.images.length > 0 ? (
            <img src={travel.images[0]} alt={travel.location} className="w-12 h-12 rounded-lg object-cover border border-[#e8e2d5]" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center text-[#aab4be]">
              <MapPin size={20} />
            </div>
          )}
          <div>
            <p className="font-medium text-[#1a1a1a] max-w-[300px] truncate">{travel.location}</p>
            {travel.period && (
              <p className="text-xs text-[#8b9aaa] mt-0.5">{travel.period}</p>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Visibility',
      key: 'is_public',
      render: (travel: Travel) => (
        <div className="flex items-center gap-1.5">
          {travel.is_public ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-600 text-xs font-semibold border border-green-100">
              <Globe size={12} /> Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-xs font-semibold border border-gray-200">
              <Lock size={12} /> Private
            </span>
          )}
          {travel.password && (
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
      render: (travel: Travel) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-[#3d4852]">{travel.images.length} Images</span>
          <span className="text-xs text-[#8b9aaa]">{travel.videos.length} Videos</span>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (travel: Travel) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/travels/${travel.id}/view`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/travels/${travel.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeleteTravelButton id={travel.id} location={travel.location} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-[#e8e2d5] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Travel Log</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Document your journeys and adventures</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <GlobalTravelPasswordForm initialPassword={settings?.travel_global_password || null} />
          <div className="hidden sm:block w-px h-8 bg-[#e8e2d5]"></div>
          <Link
            href="/admin/travels/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            Add Log
          </Link>
        </div>
      </div>

      <div className="p-8">
        <AdminTable 
          columns={columns} 
          data={travels} 
          keyField="id" 
          emptyMessage="You haven't added any travel logs yet."
          emptyIcon={<MapPin size={40} />}
        />
      </div>
    </div>
  );
}
