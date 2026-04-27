import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerInfo: { name: string; email: string };
  setCustomerInfo: React.Dispatch<React.SetStateAction<{ name: string; email: string }>>;
  handleCheckout: (e: React.FormEvent) => void;
  cartCount: number;
  totalAmount: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  customerInfo,
  setCustomerInfo,
  handleCheckout,
  cartCount,
  totalAmount
}: CheckoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Complete Order</h2>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-black/5"
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-black/5"
                    value={customerInfo.email}
                    onChange={e => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="pt-4">
                  <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Items ({cartCount})</span>
                      <span>AED {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>AED {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
