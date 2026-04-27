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

import { auth, db, googleProvider, OperationType, handleFirestoreError } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, addDoc, serverTimestamp, doc, setDoc, writeBatch } from 'firebase/firestore';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
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
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setCustomerInfo({
          name: currentUser.displayName || '',
          email: currentUser.email || ''
        });
        
        // Sync user to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        setDoc(userRef, {
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          createdAt: serverTimestamp()
        }, { merge: true }).catch(err => console.error("Error syncing user:", err));

        // Auto-provision admin if it matches the designated email
        if (currentUser.email === 'hamadshalman23@gmail.com' && currentUser.emailVerified) {
          const adminRef = doc(db, 'admins', currentUser.uid);
          setDoc(adminRef, {
            email: currentUser.email,
            assignedAt: serverTimestamp()
          }, { merge: true }).catch(err => console.log("Admin doc already exists or check ignored"));
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const productsPath = 'products';
    const unsubscribeProducts = onSnapshot(collection(db, productsPath), (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        ...doc.data()
      })) as Product[];
      
      if (prods.length > 0) {
        setProducts(prods);
      } else {
        // Fallback to API if Firestore is empty (initial seeding)
        fetch('/api/products')
          .then(res => res.json())
          .then(data => setProducts(data))
          .catch(err => console.error("API fallback failed:", err));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, productsPath);
    });

    return () => unsubscribeProducts();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

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
    const ordersPath = 'orders';
    try {
      const batch = writeBatch(db);
      
      // 1. Create the Order document reference
      const orderRef = doc(collection(db, ordersPath));
      const orderData: any = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        totalAmount,
        status: 'pending',
        createdAt: serverTimestamp()
      };
      
      if (user) {
        orderData.userId = user.uid;
      }
      
      batch.set(orderRef, orderData);
      
      // 2. Add items to subcollection
      for (const item of cart) {
        const itemRef = doc(collection(db, `orders/${orderRef.id}/items`));
        batch.set(itemRef, {
          productId: item.id,
          name: item.name,
          variantTitle: item.selectedVariant?.title || null,
          quantity: item.quantity,
          price: item.price
        });
      }

      await batch.commit();
      
      // 3. Fallback to server API
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          items: cart,
          totalAmount,
          firebaseOrderId: orderRef.id
        })
      });

      setOrderSuccess(true);
      setCart([]);
      setIsCheckoutOpen(false);
    } catch (err) {
      console.error('Checkout failed:', err);
      handleFirestoreError(err, OperationType.WRITE, ordersPath);
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
        user={user}
        onLogin={login}
        onLogout={logout}
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

      <AnimatePresence>
        {isMenuOpen && (
          <Navbar.MobileMenu 
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            user={user}
            onLogin={login}
            onLogout={logout}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setActivePage={setActivePage}
            setActiveCategory={setActiveCategory}
            setSelectedProduct={setSelectedProduct}
          />
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
        user={user}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        handleCheckout={handleCheckout}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
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
