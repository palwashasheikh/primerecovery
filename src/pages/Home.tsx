  import React from 'react';
  import { motion } from 'motion/react';
  import { ChevronRight } from 'lucide-react';
  import Benefits from '../components/Benefits';
  import ProductCard from '../components/ProductCard';
  import { Product } from '../types';

  interface HomeProps {
    products: Product[];
    categories: string[];
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    onProductClick: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    stripHtml: (html: string) => string;
  }

  export default function Home({
    products,
    categories,
    activeCategory,
    setActiveCategory,
    onProductClick,
    onAddToCart,
    stripHtml
  }: HomeProps) {
    return (
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Hero Section */}
        <header className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden bg-black text-white">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&q=80&w=2000" 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-70"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase mb-6">
                Premium Recovery Gear
              </span>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 leading-[0.9]">
                Elevate Your <br /> Recovery.
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 font-medium">
                Discover the epitome of luxury and performance with our finest ice bath, cold plunge & sauna solutions in the Middle East.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  Shop Ice Baths <ChevronRight className="w-4 h-4" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-black transition-all"
                >
                  Explore Saunas
                </motion.button>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Product Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Benefits />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-gray-500 mt-2 text-lg">Handpicked for quality and innovation.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-black text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
                onAddToCart={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                stripHtml={stripHtml}
              />
            ))}
          </div>

          {/* Ice Bath Banner Section - Just like Teckwave */}
          <section className="mb-32 relative rounded-[2.5rem] overflow-hidden bg-black h-[500px] flex items-center justify-end">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&q=80&w=2000" 
                alt="Ice Bath Banner" 
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent" />
            </div>
            <div className="relative px-12 md:px-24 max-w-2xl text-right">
              <span className="text-white/60 text-sm font-bold tracking-widest uppercase mb-4 block">Best Seller</span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">The Original <br /> Ice Bath</h2>
              <p className="text-gray-300 text-lg mb-8">
                Engineered for the ultimate cold plunge experience. Durable, portable, and incredibly effective.
              </p>
              <div className="flex justify-end">
                <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center gap-2">
                  Shop Ice Baths <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Secondary Banner Section - Just like Teckwave */}
          <section className="mt-32 relative rounded-[2.5rem] overflow-hidden bg-black h-[500px] flex items-center">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1544161515-436cefb65794?auto=format&fit=crop&q=80&w=2000" 
                alt="Sauna Banner" 
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            </div>
            <div className="relative px-12 md:px-24 max-w-2xl">
              <span className="text-white/60 text-sm font-bold tracking-widest uppercase mb-4 block">New Arrival</span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">The Ultimate <br /> Sauna Experience</h2>
              <p className="text-gray-300 text-lg mb-8">
                Immerse yourself in deep relaxation with our premium cedar wood saunas. Designed for performance and longevity.
              </p>
              <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center gap-2">
                Shop Saunas <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </main>
      </motion.div>
    );
  }
