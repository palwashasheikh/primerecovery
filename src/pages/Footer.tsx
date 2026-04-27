import React from 'react';
import { Bath } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: any) => void;
  setActiveCategory: (cat: string) => void;
}

export default function Footer({ setActivePage, setActiveCategory }: FooterProps) {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Bath className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">PRIMERECOVERY</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Elevating recovery through luxury ice baths and saunas in the UAE. Experience the power of thermal therapy.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={() => { setActivePage('home'); setActiveCategory('The Ice Bath'); }} className="hover:text-black transition-colors">Ice Baths</button></li>
              <li><button onClick={() => { setActivePage('home'); setActiveCategory('The Sauna'); }} className="hover:text-black transition-colors">Saunas</button></li>
              <li><button onClick={() => { setActivePage('home'); setActiveCategory('Chiller'); }} className="hover:text-black transition-colors">Chillers</button></li>
              <li><button onClick={() => { setActivePage('home'); setActiveCategory('All'); }} className="hover:text-black transition-colors">All Products</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Useful Links</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={() => setActivePage('blog')} className="hover:text-black transition-colors">Blog & Guides</button></li>
              <li><button onClick={() => setActivePage('gallery')} className="hover:text-black transition-colors">Gallery</button></li>
              <li><a href="#" className="hover:text-black transition-colors">Safety Protocols</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Sanitization Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={() => setActivePage('contact')} className="hover:text-black transition-colors">Contact Us</button></li>
              <li><a href="#" className="hover:text-black transition-colors">Warranty Info</a></li>
              <li><a href="#" className="hover:text-black transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Service Centers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">© 2026 PrimeRecovery. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
