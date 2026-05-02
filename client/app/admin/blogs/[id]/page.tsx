import BlogForm from '@/components/admin/blogs/BlogForm';
import { getBlogById } from '@/lib/admin/models/blogs.model';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Blog — Admin' };

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlogById(Number(resolvedParams.id));

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="px-8 pt-7 pb-5 border-b border-[#e8e2d5] flex items-center gap-3">
        <Link
          href="/admin/blogs"
          className="p-1 -ml-1 rounded-lg text-[#8b9aaa] hover:bg-[#faf7f0] hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Blog</h1>
          <p className="text-sm text-[#8b9aaa] mt-0.5">Update details for your blog post</p>
        </div>
      </div>
      <div className="p-8">
        <BlogForm blog={blog} />
      </div>
    </div>
  );
}
