import React from "react";
import { db } from "@/lib/db";
import { article as articleSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";

// Server Component
export default async function ArticleDetailPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch article
  const article = await db.query.article.findFirst({
    where: eq(articleSchema.slug, slug),
    with: { author: { columns: { name: true } } }
  });

  if (!article || !article.isPublished) {
    notFound();
  }

  // Calculate estimated reading time (approx 200 words per minute)
  const wordCount = article.content ? article.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#e8ecc4] text-[#07130e] pt-32 pb-24 selection:bg-[#07130e] selection:text-[#e8ecc4]">
      
      {/* Container */}
      <article className="max-w-[1000px] mx-auto px-6 md:px-12">
        
        {/* Back Button */}
        <Link 
          href="/article" 
          className="inline-flex items-center gap-2 text-[#07130e]/60 hover:text-[#07130e] transition-colors font-bold uppercase tracking-widest text-[12px] mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#07130e] font-bold border border-[#07130e]/20 px-3 py-1 rounded-full">
              News
            </span>
            <span className="text-[13px] font-bold text-[#07130e]/60 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {formattedDate}
            </span>
            <span className="text-[13px] font-bold text-[#07130e]/60 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {readTime} min read
            </span>
          </div>

          <h1 className="text-[40px] md:text-[60px] lg:text-[80px] font-display font-black leading-[0.95] tracking-tight uppercase text-[#07130e] mb-8">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 py-6 border-t border-b border-[#07130e]/10">
            <div className="w-12 h-12 rounded-full bg-[#07130e]/10 flex items-center justify-center font-display font-bold text-[#07130e] text-xl">
              {(article.author?.name || 'S').charAt(0)}
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-[#07130e]/50 mb-0.5">Written by</span>
              <span className="block text-[16px] font-bold uppercase tracking-tight text-[#07130e]">
                {article.author?.name || 'SRE UPNVJT'}
              </span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {article.thumbnailUrl && (
          <div className="w-full aspect-[16/9] rounded-[32px] overflow-hidden mb-16 bg-[#07130e]/5 shadow-2xl">
            <img 
              src={article.thumbnailUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="max-w-none text-[#07130e]/80 text-lg md:text-xl leading-relaxed [&>p]:mb-6 [&>h1]:text-4xl [&>h1]:font-black [&>h1]:uppercase [&>h1]:mb-6 [&>h1]:mt-12 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:uppercase [&>h2]:mb-4 [&>h2]:mt-10 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:uppercase [&>h3]:mb-4 [&>h3]:mt-8 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>a]:text-primary [&>a]:underline hover:[&>a]:text-[#07130e] [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

      </article>

    </div>
  );
}
