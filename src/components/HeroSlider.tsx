import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  accent: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1600',
    accent: 'Gold & Rock Signature',
    title: 'Artisanal Leather Bags',
    subtitle: 'Handcrafted from 100% full-grain vegetable tanned leather. Engineered for durability, styled for executives.',
    ctaText: 'Explore Collection'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1588444839799-eb0850009161?auto=format&fit=crop&q=80&w=1600',
    accent: 'Limited Time Offer',
    title: "Father's Day Flash Sale",
    subtitle: 'Save up to 30% on premium hand-stitched bifold wallets and single-strap classic harness belts.',
    ctaText: 'Shop Flash Sales'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=1600',
    accent: 'Premium Custom Tailored',
    title: 'Luxurious Smartwatch Straps',
    subtitle: 'Elevate your Apple Watch or mechanical timepiece with our durable cowhide leather bands.',
    ctaText: 'View Accessories'
  }
];

interface HeroSliderProps {
  onCtaClick: (category: string) => void;
}

export default function HeroSlider({ onCtaClick }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="relative w-full h-[280px] md:h-[420px] bg-[#0f1e36] overflow-hidden rounded-xl shadow-lg border border-slate-800" id="hero-slider-container">
      {/* Slides */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Dark Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105"
              style={{ backgroundImage: `url(${SLIDES[current].image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 text-white max-w-2xl z-10">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xs md:text-sm font-semibold tracking-wider text-brand-orange uppercase bg-brand-orange/15 border border-brand-orange/30 px-3 py-1 rounded-full w-fit mb-3"
              >
                {SLIDES[current].accent}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl md:text-4xl font-bold font-display tracking-tight leading-tight mb-2 text-white"
              >
                {SLIDES[current].title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xs md:text-base text-slate-300 font-light max-w-lg mb-6 line-clamp-2 md:line-clamp-none"
              >
                {SLIDES[current].subtitle}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const targetCategory = SLIDES[current].id === 1 ? 'bags' : SLIDES[current].id === 2 ? 'flash' : 'accessories';
                  onCtaClick(targetCategory);
                }}
                className="bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold text-xs md:text-sm px-6 py-3 rounded-lg w-fit shadow-md transition-colors flex items-center gap-2 cursor-pointer border border-brand-orange"
                id={`hero-cta-btn-${SLIDES[current].id}`}
              >
                {SLIDES[current].ctaText}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-1.5 md:p-2.5 rounded-full backdrop-blur-sm transition-all focus:outline-none hidden md:block"
        id="hero-slider-prev-btn"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-1.5 md:p-2.5 rounded-full backdrop-blur-sm transition-all focus:outline-none hidden md:block"
        id="hero-slider-next-btn"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index ? 'w-6 bg-brand-orange' : 'w-2 bg-white/50'
            }`}
            id={`hero-indicator-${index}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
