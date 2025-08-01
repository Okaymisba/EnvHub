import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { blogPosts } from '@/types/blog';

export const Blog = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="relative min-h-[calc(100vh-4rem)] pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl pt-16 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
              The Blog
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Latest articles, tutorials, and news about environment variables, security, and development best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => {
              const readingTime = Math.ceil(post.content.split(' ').length / 200);
              
              return (
                <motion.article 
                  key={post.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <Link to={`/blog/${post.slug}`} className="block h-full">
                    {post.coverImage && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
                        <div className="flex items-center gap-1.5 bg-gray-800/50 px-3 py-1 rounded-full">
                          <Calendar className="h-3.5 w-3.5 text-purple-400" />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-800/50 px-3 py-1 rounded-full">
                          <Clock className="h-3.5 w-3.5 text-purple-400" />
                          {readingTime} min read
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-2">
                          <img 
                            src={post.author.avatar} 
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-300">{post.author.name}</span>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-purple-400">
                            <TagIcon className="h-3.5 w-3.5" />
                            {post.tags[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
