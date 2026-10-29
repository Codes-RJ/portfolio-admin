import { SiteText } from '../components/ui/SiteText';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useContentSlice, useContentStatus } from '../context/contentSubscriptions';
import { ContentAvailability } from '../components/ui/ContentAvailability';

export const BlogDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const blogPosts = useContentSlice('blogPosts');
  const contentSyncState = useContentStatus();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post && contentSyncState === 'loading') return <ContentAvailability state="loading" backTo="/blog" />;
  if (!post && ['failed', 'invalid', 'missing'].includes(contentSyncState)) return <ContentAvailability state="unavailable" backTo="/blog" />;

  if (!post) return <div className="pt-32 pb-20 max-w-3xl mx-auto px-4"><h1 className="text-3xl font-bold"><SiteText id="BlogDetailPage.af6ccf95df70">{"Article not found"}</SiteText></h1><Link to="/blog" className="mt-6 inline-flex text-[var(--color-primary)]"><SiteText id="BlogDetailPage.dde30a6e69b8">{"Back to articles"}</SiteText></Link></div>;

  return (
    <article className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"><ArrowLeft className="w-4 h-4" /><SiteText id="BlogDetailPage.387bff93c3bb">{"All articles"}</SiteText></Link>
      {post.image && <ResponsiveImage src={post.image} alt="" sizes="(max-width: 768px) 92vw, 720px" className="w-full aspect-video object-cover rounded-3xl border border-gray-200 dark:border-gray-800" />}
      <header className="space-y-4">
        <div className="text-sm font-mono text-[var(--color-primary)]">{post.category}</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">{post.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{post.summary}</p>
        <div className="flex gap-4 text-sm text-gray-500"><span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.publishedAt}</span><span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime}</span></div>
      </header>
      <div className="whitespace-pre-wrap text-base leading-8 text-gray-700 dark:text-gray-300">{post.content}</div>
      <div className="flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">{tag}</span>)}</div>
    </article>
  );
};
