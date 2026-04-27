import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bath, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';
import { FALLBACK_IMAGE } from '../constants';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (productId: number, delta: number, variantId?: number) => void;
  removeFromCart: (productId: number, variantId?: number) => void;
  totalAmount: number;
  onCheckout: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  totalAmount,
  onCheckout
}: CartSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Bath className="w-12 h-12 mb-4 opacity-20" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={`${item.id}-${item.selectedVariant?.id}`} className="flex gap-4">
                    <img src={item.image || FALLBACK_IMAGE} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                    <div className="flex-1">
                      <h4 className="font-bold">{item.name}</h4>
                      {item.selectedVariant && (
                        <p className="text-xs text-gray-400 mb-1">{item.selectedVariant.title}</p>
                      )}
                      <p className="text-sm text-gray-500">AED {item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.id, -1, item.selectedVariant?.id)} className="p-1 hover:bg-gray-100 rounded-md">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1, item.selectedVariant?.id)} className="p-1 hover:bg-gray-100 rounded-md">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.selectedVariant?.id)} className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-xl">AED {totalAmount.toLocaleString()}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
