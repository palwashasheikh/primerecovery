import React from 'react';
import { motion } from 'motion/react';

export default function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544161515-436cefb65794?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2158?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1507034589631-9433c6bc453e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1518611012118-2969c6360207?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Recovery in Action</h1>
        <p className="text-gray-500">A glimpse into the PrimeRecovery lifestyle and our premium installations.</p>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <img 
              src={img} 
              alt={`Gallery item ${i}`} 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white font-medium px-4 py-2 border border-white/50 rounded-full backdrop-blur-sm">View Details</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
