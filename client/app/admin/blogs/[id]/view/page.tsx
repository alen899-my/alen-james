import { getBlogById } from '@/lib/admin/models/blogs.model';
import Link from 'next/link';
import { ArrowLeft, Pencil, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'View Blog — Admin' };

export default async function ViewBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlogById(Number(resolvedParams.id));

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">{blog.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                blog.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {blog.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                {blog.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <p className="text-xs text-[#8b9aaa] flex items-center gap-1">
                <Calendar size={12} />
                {blog.publish_date 
                  ? new Date(blog.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                  : 'No Date'}
              </p>
            </div>
          </div>
        </div>
        <Link
          href={`/admin/blogs/${blog.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-[#1084a2] text-white rounded-xl text-sm font-medium hover:bg-[#1a9bbf] transition-colors shadow-sm"
        >
          <Pencil size={16} />
          Edit Blog
        </Link>
      </div>

      <div className="p-8 space-y-10">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {blog.description && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aab4be] mb-3">Blog Content</h2>
                <div className="bg-white p-8 rounded-2xl border border-[#e8e2d5] shadow-sm">
                  <div className="prose prose-sm max-w-none text-[#3d4852] leading-relaxed whitespace-pre-wrap">
                    {blog.description}
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* Main Image */}
            {blog.main_image && (
              <section>
                <h2 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-3">Cover Image</h2>
                <div className="rounded-2xl overflow-hidden border border-[#e8e2d5] shadow-sm aspect-video bg-gray-100">
                  <img src={blog.main_image} alt={blog.title} className="w-full h-full object-cover" />
                </div>
              </section>
            )}

            {/* Video */}
            {blog.video_url && (
              <section>
                <h2 className="text-xs font-bold text-[#aab4be] uppercase tracking-widest mb-3">Featured Video</h2>
                <div className="rounded-2xl overflow-hidden border border-[#e8e2d5] bg-black shadow-sm aspect-video">
                  <video src={blog.video_url} controls className="w-full h-full object-contain" />
                </div>
              </section>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
