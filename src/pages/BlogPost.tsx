// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '@/types/blog';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Tag as TagIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import '@/styles/markdown.css';
import Navbar from "@/components/Navbar.tsx";
import {Footer} from "@/components/Footer.tsx";

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((post) => post.slug === slug);

  if (!post) {
    return (
      <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans">
        <Helmet>
          <title>Post Not Found | Envhub Blog</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 pt-32 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Post Not Found</h1>
          <p className="text-xl text-gray-300 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 group"
          >
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans">
      <Helmet>
        <title>{post.title} | Envhub Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={`${post.tags?.join(', ')}, envhub, environment variables, development`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`${window.location.origin}/blog/${post.slug}`} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.coverImage && <meta name="twitter:image" content={post.coverImage} />}
        
        <link rel="canonical" href={`${window.location.origin}/blog/${post.slug}`} />
        <meta name="article:published_time" content={new Date(post.publishedAt).toISOString()} />
        <meta name="article:author" content={post.author.name} />
      </Helmet>
      
      <Navbar />
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
        >
          <Link
            to="/blog"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
              <Calendar className="h-4 w-4 text-purple-400" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4 text-purple-400" />
              {readingTime} min read
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mb-12">
            <img
              className="h-14 w-14 rounded-full border-2 border-purple-500/50"
              src={post.author.avatar}
              alt={post.author.name}
            />
            <div>
              <p className="text-lg font-medium text-white">{post.author.name}</p>
              <p className="text-sm text-gray-400">Author</p>
            </div>
          </div>

          {post.coverImage && (
            <div className="mb-12 rounded-xl overflow-hidden border border-gray-800">
              <img
                className="w-full h-auto object-cover"
                src={post.coverImage}
                alt={post.title}
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
                components={{
                    code({node, className, children, ...props}: {
                        node?: any;
                        className?: string;
                        children: React.ReactNode;
                        inline?: boolean;
                    }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !props.inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                a: ({node, ...props}) => (
                  <a 
                    {...props} 
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mt-10 mb-6" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-300" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote 
                    className="border-l-4 border-purple-500 pl-4 italic text-gray-300 my-4" 
                    {...props} 
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-purple-400" />
                TAGS
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-800/50 text-gray-200 hover:bg-purple-900/30 hover:text-white transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
