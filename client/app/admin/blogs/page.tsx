import { getAllBlogs, Blog } from '@/lib/admin/models/blogs.model';
import Link from 'next/link';
import { FileText, Plus, Pencil, Eye, CheckCircle2, XCircle, Image as ImageIcon } from 'lucide-react';
import DeleteBlogButton from './delete-blog-button';
import AdminTable from '@/components/admin/common/AdminTable';

export const metadata = { title: 'Blogs — Admin' };

export default async function BlogsPage() {
  const blogs = await getAllBlogs();

  const columns = [
    {
      header: 'Blog Title',
      key: 'title',
      render: (blog: Blog) => (
        <div className="flex items-center gap-4">
          {blog.main_image ? (
            <img src={blog.main_image} alt={blog.title} className="w-12 h-12 rounded-lg object-cover border border-[#e8e2d5]" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#faf7f0] border border-[#e8e2d5] flex items-center justify-center text-[#aab4be]">
              <ImageIcon size={20} />
            </div>
          )}
          <div>
            <p className="font-medium text-[#1a1a1a] max-w-[300px] truncate">{blog.title}</p>
            <p className="text-xs text-[#8b9aaa] mt-0.5">
              {blog.publish_date 
                ? new Date(blog.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                : 'No Date'}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (blog: Blog) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
          blog.status === 'active' 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-gray-50 text-gray-600 border-gray-200'
        }`}>
          {blog.status === 'active' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
          {blog.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (blog: Blog) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/blogs/${blog.id}/view`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/admin/blogs/${blog.id}`}
            className="p-2 text-[#8b9aaa] hover:text-[#1084a2] hover:bg-[#1084a2]/10 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </Link>
          <DeleteBlogButton id={blog.id} title={blog.title} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Blogs</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Manage your blog posts and articles</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Create Blog
        </Link>
      </div>

      <div className="p-8">
        <AdminTable 
          columns={columns} 
          data={blogs} 
          keyField="id" 
          emptyMessage="You haven't published any blogs yet."
          emptyIcon={<FileText size={40} />}
        />
      </div>
    </div>
  );
}
