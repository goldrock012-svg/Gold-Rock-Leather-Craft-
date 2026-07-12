import { getMockCategories } from '../services/firebaseMock';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoriesTabProps {
  onSelectCategory: (categoryName: string) => void;
}

export default function CategoriesTab({ onSelectCategory }: CategoriesTabProps) {
  const categories = getMockCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10" id="categories-tab-view">
      {/* Title & Introduction */}
      <div className="text-center mb-8 md:mb-12">
        <span className="text-xs font-semibold tracking-wider text-brand-orange uppercase bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full w-fit mx-auto flex items-center gap-1 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Gold & Rock Catalogue</span>
        </span>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 leading-tight">
          Browse Handcrafted Collections
        </h2>
        <p className="text-sm text-slate-500 font-light mt-2 max-w-md mx-auto">
          Explore artisanal leather products crafted with absolute precision, double-stitching, and premium organic materials.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative h-48 md:h-56 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md cursor-pointer"
            whileHover={{ y: -4, scale: 1.01 }}
            id={`category-card-${cat.id}`}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

            {/* Category Description */}
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-brand-orange uppercase font-bold mb-1">
                  Collection
                </span>
                <h3 className="text-lg md:text-xl font-bold font-display tracking-tight text-white">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 font-light mt-0.5">
                  {cat.id === 'bags' && 'Executive messenger bags, folios & spacious tote bags.'}
                  {cat.id === 'wallets' && 'Slim cardholders & premium hand-stitched bifold wallets.'}
                  {cat.id === 'belts' && 'Single piece thick harness leather straps with brass buckles.'}
                  {cat.id === 'accessories' && 'Watch straps, passport jackets & compact key organizers.'}
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="p-2 bg-brand-orange group-hover:bg-brand-orange-dark text-white rounded-full transition-all shrink-0">
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
