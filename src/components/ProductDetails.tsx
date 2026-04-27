import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { FALLBACK_IMAGE } from '../constants';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product & { selectedVariant?: ProductVariant; quantity?: number }) => void;
}

export default function ProductDetails({ product, onBack, onAddToCart }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options?.forEach((opt, idx) => {
      initial[opt.name] = opt.values[0];
    });
    return initial;
  });

  const selectedVariant = product.variants?.find(v => {
    return (
      (!product.options?.[0] || v.option1 === selectedOptions[product.options[0].name]) &&
      (!product.options?.[1] || v.option2 === selectedOptions[product.options[1].name]) &&
      (!product.options?.[2] || v.option3 === selectedOptions[product.options[2].name])
    );
  }) || product.variants?.[0] || null;

  const currentPrice = selectedVariant ? parseFloat(selectedVariant.price) : product.price;

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      price: currentPrice,
      selectedVariant: selectedVariant || undefined,
      quantity: quantity
    });
  };
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-black/5">
            <img 
              src={product.image || FALLBACK_IMAGE} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-black/5 cursor-pointer hover:opacity-80 transition-opacity">
                <img 
                  src={product.image ? `${product.image}?sig=${i}` : `${FALLBACK_IMAGE}?sig=${i}`} 
                  alt={`${product.name} view ${i}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-black/5 text-xs font-semibold tracking-wider uppercase mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
            <p className="text-3xl font-light text-gray-900">AED {currentPrice.toLocaleString()}</p>
          </div>

          {product.options && product.options.length > 0 && (
            <div className="space-y-6 mb-8">
              {product.options.map((option) => (
                <div key={option.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    {option.name}: <span className="text-black font-bold">{selectedOptions[option.name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => handleOptionChange(option.name, value)}
                        className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          selectedOptions[option.name] === value
                            ? 'bg-black text-white border-black shadow-md'
                            : 'bg-white text-gray-600 border-black/10 hover:border-black'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
            <div 
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <div className="flex items-center gap-6 mb-10">
            <div className="flex items-center border border-black/10 rounded-xl p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
