'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { products } from '@/data/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductBottleScroll from '@/components/ProductBottleScroll';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const product = products[currentIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
    // Set custom property for gradient and theme color
    document.documentElement.style.setProperty('--product-gradient', product.gradient);
    document.documentElement.style.setProperty('--product-main', product.themeColor);
  }, [currentIndex, product]);

  const nextProduct = () => setCurrentIndex((prev) => (prev + 1) % products.length);
  const prevProduct = () => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);

  return (
    <main className="min-h-screen text-white">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Scroll Experience */}
          <ProductBottleScroll product={product} />

          {/* Static Content - Appears after the scroll sequence */}
          <div className="relative z-10 bg-gradient-to-b from-transparent to-black/20 backdrop-blur-[2px] -mt-20">

            <div className="container mx-auto px-6 py-24 space-y-32">
              {/* Details Section */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center gap-12"
              >
                <div className="flex-1 w-full">
                  <div className="aspect-square bg-white/10 rounded-3xl overflow-hidden relative shadow-2xl skew-y-3 transform transition-transform hover:skew-y-0">
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-bold bg-gradient-to-br from-white/10 to-transparent">
                      {product?.detailsSection?.imageAlt || 'Product Image'}
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <h3 className="text-4xl md:text-5xl font-bold">{product?.detailsSection?.title}</h3>
                  <p className="text-xl text-white/80 leading-relaxed">{product?.detailsSection?.description}</p>
                </div>
              </motion.section>

              {/* Freshness Section */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto space-y-8"
              >
                <h3 className="text-4xl md:text-5xl font-bold">{product?.freshnessSection?.title}</h3>
                <p className="text-xl text-white/80 leading-relaxed">{product?.freshnessSection?.description}</p>
              </motion.section>

              {/* Buy Now Section */}
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md border border-white/10"
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-5xl md:text-6xl font-bold">{product?.buyNowSection?.price} <span className="text-2xl font-normal text-white/60">{product?.buyNowSection?.unit}</span></h3>
                    <div className="flex flex-wrap gap-2">
                      {product?.buyNowSection?.processingParams?.map(p => (
                        <span key={p} className="px-4 py-1 rounded-full border border-white/20 bg-white/5 text-sm uppercase tracking-wider">{p}</span>
                      ))}
                    </div>
                    <p className="text-white/80 text-lg">{product?.buyNowSection?.deliveryPromise}</p>
                    <p className="text-white/60 text-sm italic">{product?.buyNowSection?.returnPolicy}</p>
                  </div>
                  <div className="text-center">
                    <button className="w-full py-5 bg-white text-black font-black text-2xl rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Next Flavor Button */}
            <div className="text-center pb-32 pt-12">
              <button onClick={nextProduct} className="group relative inline-flex items-center gap-2 text-2xl md:text-4xl font-bold transition-colors">
                <span className="border-b-2 border-white/20 pb-1 group-hover:border-white">
                  Next Flavor: {products[(currentIndex + 1) % products.length].name}
                </span>
                <span className="transform group-hover:translate-x-2 transition-transform">&rarr;</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center gap-4">
        {products.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to ${p.name}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${idx === currentIndex ? 'bg-white w-8 scale-110' : 'bg-white/40 hover:bg-white/80'}`}
          />
        ))}
      </div>

      <button
        onClick={prevProduct}
        aria-label="Previous Flavor"
        className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/10 hover:bg-black/30 text-white backdrop-blur-md transition-all hover:scale-110 hidden md:block"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={nextProduct}
        aria-label="Next Flavor"
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/10 hover:bg-black/30 text-white backdrop-blur-md transition-all hover:scale-110 hidden md:block"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      <Footer />
    </main>
  );
}
