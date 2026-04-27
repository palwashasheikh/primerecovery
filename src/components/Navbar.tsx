import React from 'react';
import { Search, Bath, ShoppingCart, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  activePage: string;
  setActivePage: (page: any) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onLogoClick: () => void;
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  onOpenMenu,
  activePage,
  setActivePage,
  activeCategory,
  setActiveCategory,
  onLogoClick
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            {/* Search on the Left */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 border-none rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/5 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={onLogoClick}
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Bath className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">PRIMERECOVERY</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => {
                setActivePage('home');
                setActiveCategory('The Ice Bath');
              }}
              className={`text-sm font-medium transition-colors ${activeCategory === 'The Ice Bath' && activePage === 'home' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              The Ice Bath
            </button>
            <button 
              onClick={() => {
                setActivePage('home');
                setActiveCategory('The Sauna');
              }}
              className={`text-sm font-medium transition-colors ${activeCategory === 'The Sauna' && activePage === 'home' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              The Sauna
            </button>
            <button 
              onClick={() => setActivePage('blog')}
              className={`text-sm font-medium transition-colors ${activePage === 'blog' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Blog
            </button>
            <button 
              onClick={() => setActivePage('gallery')}
              className={`text-sm font-medium transition-colors ${activePage === 'gallery' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Gallery
            </button>
            <button 
              onClick={() => setActivePage('contact')}
              className={`text-sm font-medium transition-colors ${activePage === 'contact' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenCart}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={onOpenMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.MobileMenu = ({ 
  isOpen, 
  onClose, 
  searchQuery, 
  setSearchQuery, 
  setActivePage, 
  setActiveCategory, 
  setSelectedProduct 
}: any) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        className="fixed left-0 top-0 h-full w-full max-w-xs bg-white z-50 shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b flex justify-between items-center">
          <span className="text-xl font-bold tracking-tight">MENU</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/5"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActivePage('home');
                setSelectedProduct(null);
              }}
            />
          </div>
          <nav className="space-y-4">
            <button 
              onClick={() => { setActivePage('home'); setActiveCategory('The Ice Bath'); onClose(); setSelectedProduct(null); }}
              className="block w-full text-left text-lg font-medium py-2 border-b border-gray-50"
            >
              The Ice Bath
            </button>
            <button 
              onClick={() => { setActivePage('home'); setActiveCategory('The Sauna'); onClose(); setSelectedProduct(null); }}
              className="block w-full text-left text-lg font-medium py-2 border-b border-gray-50"
            >
              The Sauna
            </button>
            <button 
              onClick={() => { setActivePage('blog'); onClose(); setSelectedProduct(null); }}
              className="block w-full text-left text-lg font-medium py-2 border-b border-gray-50"
            >
              Blog
            </button>
            <button 
              onClick={() => { setActivePage('gallery'); onClose(); setSelectedProduct(null); }}
              className="block w-full text-left text-lg font-medium py-2 border-b border-gray-50"
            >
              Gallery
            </button>
            <button 
              onClick={() => { setActivePage('contact'); onClose(); setSelectedProduct(null); }}
              className="block w-full text-left text-lg font-medium py-2 border-b border-gray-50"
            >
              Contact
            </button>
          </nav>
        </div>
      </motion.div>
    </>
  );
};
