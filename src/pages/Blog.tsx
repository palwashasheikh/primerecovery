import React from 'react';
import { motion } from 'motion/react';

export default function Blog() {
  const posts = [
    {
      title: "Top 12 Benefits of Ice Bath & Cold Plunge",
      excerpt: "Discover how cold exposure can transform your health, from muscle recovery to mental clarity.",
      image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&q=80&w=800",
      date: "Oct 24, 2023"
    },
    {
      title: "Cold Plunge & Ice Bath Sanitization",
      excerpt: "Keep your water crystal clear with our ultimate guide to ice bath maintenance.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
      date: "Oct 20, 2023"
    },
    {
      title: "Ice Bath or Sauna: Which Should You Start With?",
      excerpt: "The science behind contrast therapy and how to optimize your recovery routine.",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800",
      date: "Oct 15, 2023"
    }
  ];

  return (
    <motion.div
      key="blog"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <h1 className="text-4xl font-bold mb-12">Latest from the Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-4">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-sm text-gray-500 mb-2">{post.date}</p>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
            <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
