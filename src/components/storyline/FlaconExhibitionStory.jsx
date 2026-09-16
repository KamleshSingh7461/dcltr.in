import React, { useState } from 'react';
import { ArrowRight, Lock, Award, Droplets, CheckCircle2, Calculator, Sparkles } from 'lucide-react';
import PerfumeBottle3D from '../3d/PerfumeBottle3D';
import { useMarketplace } from '../../context/MarketplaceContext';

export default function FlaconExhibitionStory() {
  const { setActiveModal, setFilters, formatPrice } = useMarketplace();
  const [activeChapter, setActiveChapter] = useState(0);

  // Interactive Value Comparison Calculator
  const [calcMl, setCalcMl] = useState(25);
  const retailMsrp100ml = 495; // e.g. Creed Aventus / MFK MSRP
  const partialCost = Math.round((retailMsrp100ml * 0.45) * (calcMl / 50));
  const fullBottleCost = retailMsrp100ml;
  const savedAmount = fullBottleCost - partialCost;

  const chapters = [
    {
      id: 'partials',
      tag: 'CHAPTER I : THE VOLUME REVOLUTION',
      title: 'The Value of Pre-Loved Partials',
      subtitle: 'Why smart fragrance collectors trade 20ml and 50ml remnants.',
      description: 'Acquiring a 100ml retail bottle often leaves 70% of the fragrance sitting unused on a shelf for years. dcltr.in unlocks high-tier niche formulations—allowing you to acquire 50ml or 20ml partials with verified liquid line measurements at fair market value.',
      cta: 'Explore 50ml Partials',
      filterAction: () => {
        setFilters(prev => ({ ...prev, fillPreset: '50ml', condition: 'all' }));
        document.getElementById('exchange-grid')?.scrollIntoView({ behavior: 'smooth' });
      },
      stats: [
        { label: 'Average Savings', val: '45-60%' },
        { label: 'Fluid Accuracy', val: '± 0.5 ml' },
        { label: 'Verification Method', val: 'Backlit Meniscus' }
      ]
    },
    {
      id: 'vintages',
      tag: 'CHAPTER II : PROVENANCE & VINTAGES',
      title: 'Pre-Reformulation Batches',
      subtitle: 'Preserving rare vintage formulations and discontinued gems.',
      description: 'Industry reformulations alter the silage and projection of classic scents. Our community members list certified vintage batches—such as pre-reformulation Creed Aventus or rare Tom Ford Private Blends—cross-referenced with verified batch databases.',
      cta: 'Browse Vintage Archive',
      filterAction: () => {
        setFilters(prev => ({ ...prev, condition: 'partial', fillPreset: 'all' }));
        document.getElementById('exchange-grid')?.scrollIntoView({ behavior: 'smooth' });
      },
      stats: [
        { label: 'Batches Cataloged', val: '2,400+' },
        { label: 'Formulation Check', val: 'Year Matched' },
        { label: 'Storage Inspection', val: 'Dark & Cool' }
      ]
    },
    {
      id: 'escrow',
      tag: 'CHAPTER III : 100% BUYER ESCROW',
      title: 'The 48-Hour Escrow Guarantee',
      subtitle: 'Zero counterfeit risk. Inspect and test spray before funds release.',
      description: 'Payments on dcltr.in are locked safely in escrow. When the tracked package arrives, you have a full 48-hour inspection period to verify the bottle cap, test the atomizer spray pattern, and confirm the batch code before the seller receives payout.',
      cta: 'List a Fragrance for Sale',
      filterAction: () => setActiveModal('sellWizard'),
      stats: [
        { label: 'Inspection Window', val: '48 Hours' },
        { label: 'Counterfeit Rate', val: '0.00%' },
        { label: 'Dispute Resolution', val: 'Admin Protected' }
      ]
    }
  ];

  const current = chapters[activeChapter];

  return (
    <section className="relative w-full py-14 sm:py-20 bg-gray-50 border-b border-gray-200 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Exhibition Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW DCLTR.COM REVOLUTIONIZES FRAGRANCE COLLECTING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            The Smarter Way to Buy & Trade Fine Perfumery
          </h2>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">
            Discover why trading partial bottles, vintage formulations, and verified lots is the future of luxury fragrance collecting.
          </p>

          {/* Chapter Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeChapter === idx
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{ch.tag.split(':')[1] || ch.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Chapter Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Narrative & Interactive Value Calculator */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600">
              {current.tag}
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {current.title}
              </h3>
              <p className="text-amber-700 font-bold text-sm sm:text-base mt-1">
                {current.subtitle}
              </p>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {current.description}
            </p>

            {/* Interactive Calculator */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-purple-600" /> Partial Bottle Value Simulator
                </span>
                <span className="text-purple-700 font-extrabold text-sm">{calcMl} ML Partial</span>
              </div>

              <div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={calcMl}
                  onChange={(e) => setCalcMl(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
                  <span>10ml Travel Remnant</span>
                  <span>50ml Half Flacon</span>
                  <span>80ml Full Presentation</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-xs">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Retail MSRP (100ml)</div>
                  <div className="font-bold text-gray-400 line-through mt-0.5">{formatPrice(fullBottleCost)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">dcltr.in Price</div>
                  <div className="font-bold text-purple-700 text-sm mt-0.5">{formatPrice(partialCost)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Money Saved</div>
                  <div className="font-bold text-emerald-600 text-sm mt-0.5">+{formatPrice(savedAmount)}</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={current.filterAction}
                className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2"
              >
                <span>{current.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: 3D Interactive WebGL Flacon Viewer */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xl relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
                <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                  Interactive 3D Fluid & Atomizer Simulator
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  WebGL 3D
                </span>
              </div>

              {/* 3D WebGL Flacon Component */}
              <PerfumeBottle3D
                initialFill={activeChapter === 0 ? calcMl : (activeChapter === 1 ? 75 : 100)}
                initialJuiceColor={activeChapter === 0 ? '#D4AF37' : (activeChapter === 1 ? '#A35836' : '#D37260')}
                interactiveControls={true}
              />

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
