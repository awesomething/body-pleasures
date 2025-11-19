import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Newsletter from './components/Newsletter';
import About from './components/About';
import Contact from './components/Contact';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import { products as allProducts, Product } from './data/products';

import N8NChat from './components/N8NChat';

type Page = 'home' | 'shop' | 'about' | 'contact';

export interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [page, setPage] = useState<Page>('home');

  // FIX: Cart now stores quantity
  const [cart, setCart] = useState<CartItem[]>([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const featured = allProducts.slice(0, 6);

  const filtered = useMemo(
    () => (filter === 'all'
      ? allProducts
      : allProducts.filter(p => p.category === filter)),
    [filter]
  );

  /** FIX: Add to cart without duplicates */
  function addToCart(id: number) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === id);

      if (existing) {
        return prev.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...p, quantity: 1 }];
    });

    
  }

  /** FIX: Remove item */
  function removeFromCart(id: number) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  /** FIX: Decrease quantity */
  function decreaseQuantity(id: number) {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }
  function handleRemove(id: number | "ALL") {
    if (id === "ALL") {
      setCart([]);   // Clear cart
    } else {
      setCart(prev => prev.filter(item => item.id !== id));
    }
  }
  

  /** FIX: Increase quantity */
  function increaseQuantity(id: number) {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function handleNavigate(p: Page) {
    setPage(p);
    window.scrollTo(0, 0);
  }

  function handleFilter(cat: string) {
    setFilter(cat);
  }

  function checkout() {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some products first!');
      return;
    }
    alert('Checkout feature coming soon! Thank you for your interest.');
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white" style={{ fontFamily: "'Lato', sans-serif" }}>
      <Header
        onNavigate={(p) => handleNavigate(p as Page)}
        onToggleCart={() => setCartOpen(v => !v)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} // FIX
      />

      <main className="pt-28">
        {page === 'home' && (
          <>
            <Hero onShop={() => handleNavigate('shop')} />

            <section className="px-6 py-16 max-w-[1200px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold" style={{ fontFamily: "'Playfair Display', serif" }}>Featured Collections</h2>
                <p className="text-white/80">Discover our handcrafted wellness essentials</p>
              </div>

              <ProductGrid products={featured} onAdd={addToCart} />
            </section>

            <Newsletter />
          </>
        )}

        {page === 'shop' && (
          <section className="px-6 pt-16 pb-24 max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold" style={{ fontFamily: "'Playfair Display', serif" }}>Our Collection</h2>
              <p className="text-white/80">Explore our full range of artisan wellness products</p>
            </div>

            <div className="category-tabs">
              {['all','soaps','creams','candles','beard','relief','sprays'].map(cat => (
                <button
                  key={cat}
                  className={`category-tab ${filter === cat ? 'active' : ''}`}
                  onClick={() => handleFilter(cat)}
                >
                  {cat === 'all'
                    ? 'All Products'
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>


            <ProductGrid products={filtered} onAdd={addToCart} />
          </section>
        )}

        {page === 'about' && <About />}

        {page === 'contact' && <Contact />}

        <Footer />
      </main>

      <CartSidebar
  isOpen={cartOpen}
  cartItems={cart}
  onClose={() => setCartOpen(false)}
  onCheckout={checkout}
  onIncrease={increaseQuantity}   // or the function name you used for increase
  onDecrease={decreaseQuantity}   // or the function name you used for decrease
  onRemove={handleRemove}         // handleRemove should accept number | "ALL"
/>



      <N8NChat />
    </div>
  );
}

export default App;
