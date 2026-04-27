import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import { Product, CartItem, ProductVariant } from './types';
import ProductDetails from './components/ProductDetails';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePage, setActivePage] = useState<'home' | 'blog' | 'gallery' | 'contact'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setTimeout(async () => {
          try {
            const res = await fetch('/api/products');
            if (res.ok) {
              const data = await res.json();
              setProducts(data);
            }
          } catch (retryErr) {
            console.error('Retry failed:', retryErr);
          }
        }, 2000);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product & { selectedVariant?: ProductVariant; quantity?: number }) => {
    const qtyToAdd = product.quantity || 1;
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedVariant?.id === product.selectedVariant?.id
      );
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedVariant?.id === product.selectedVariant?.id)
            ? { ...item, quantity: item.quantity + qtyToAdd } 
            : item
        );
      }
      // Remove quantity from product before spreading to avoid conflict if it exists, 
      // but here we are spreading and then setting quantity: qtyToAdd which is fine.
      return [...prev, { ...product, quantity: qtyToAdd }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, variantId?: number) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && item.selectedVariant?.id === variantId)
    ));
  };

  const updateQuantity = (productId: number, delta: number, variantId?: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.selectedVariant?.id === variantId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const categories: string[] = ['All', ...Array.from(new Set<string>(products.map(p => p.category)))];
  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          items: cart,
          totalAmount
        })
      });
      if (res.ok) {
        setOrderSuccess(true);
        setCart([]);
        setIsCheckoutOpen(false);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const cleanActiveCategory = activeCategory.toLowerCase().replace('the ', '');
    const matchesCategory = activeCategory === 'All' || 
                           p.category.toLowerCase().includes(cleanActiveCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        activePage={activePage}
        setActivePage={setActivePage}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onLogoClick={() => {
          setSelectedProduct(null);
          setActivePage('home');
          setActiveCategory('All');
        }}
      />

      {/* Mobile Menu logic is handled inside Navbar or as a separate component, 
          but for now I'll keep the AnimatePresence for Menu here or move it to Navbar.
          Actually, I'll move the Mobile Menu logic to a separate component or keep it in App for now if it's complex.
          Wait, I didn't create a MobileMenu component yet. I'll keep it in App for a moment then move it.
      */}
      
      {/* Mobile Menu (Moved logic to Navbar would be better, but let's keep it consistent with previous edits) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <Navbar.MobileMenu 
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setActivePage={setActivePage}
              setActiveCategory={setActiveCategory}
              setSelectedProduct={setSelectedProduct}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedProduct ? (
          <ProductDetails 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
            onAddToCart={addToCart} 
          />
        ) : activePage === 'blog' ? (
          <Blog />
        ) : activePage === 'gallery' ? (
          <Gallery />
        ) : activePage === 'contact' ? (
          <Contact />
        ) : (
          <Home 
            products={filteredProducts}
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onProductClick={setSelectedProduct}
            onAddToCart={addToCart}
            stripHtml={stripHtml}
          />
        )}
      </AnimatePresence>

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        totalAmount={totalAmount}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        handleCheckout={handleCheckout}
        cartCount={cart.length}
        totalAmount={totalAmount}
      />

      {/* Success Toast */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-[70]">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold">Order Placed Successfully!</p>
              <p className="text-sm opacity-90">We've sent a confirmation to your email.</p>
            </div>
            <button onClick={() => setOrderSuccess(false)} className="ml-4 hover:opacity-70">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </AnimatePresence>

      <Footer 
        setActivePage={setActivePage}
        setActiveCategory={setActiveCategory}
      />
    </div>
  );
}
