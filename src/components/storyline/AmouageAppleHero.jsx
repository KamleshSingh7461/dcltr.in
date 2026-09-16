import React, { useState } from 'react';
import { 
  Sparkles, Layers, ArrowRight, ShieldCheck, 
  Wind, Lock, Zap, CheckCircle2, Sliders, 
  ChevronRight, Droplets, Box, Compass, Flame
} from 'lucide-react';
import AmouageBottle3D from '../3d/AmouageBottle3D';
import { useMarketplace } from '../../context/MarketplaceContext';

export default function AmouageAppleHero() {
  const { setActiveModal, setFilters, formatPrice } = useMarketplace();

  const [activeStoryStage, setActiveStoryStage] = useState(0); // 0: Monolith, 1: Exploded, 2: Notes, 3: Exchange Value
  const [activeEdition, setActiveEdition] = useState('interlude');
  const [explosionSlider, setExplosionSlider] = useState(0); // 0 to 1
  const [sprayCount, setSprayCount] = useState(0);

  // Amouage Formulations
  const editions = [
    {
      id: 'interlude',
      name: 'Interlude 53',
      sub: 'The Blue Beast Extrait',
      concentration: 'Extrait de Parfum (53%)',
      retail: 560,
      dcltrPrice: 220,
      fill: '85ml / 100ml (85% Full)',
      accords: ['Smoky Oud', 'Amber', 'Oregano', 'Frankincense', 'Leather'],
      top: 'Bergamot, Oregano, Pimento Berry',
      heart: 'Amber, Frankincense, Cistus, Opoponax',
      base: 'Leather, Agarwood Smoke, Patchouli, Sandalwood',
      batch: '#53V01 (2021 Maceration)',
      color: '#2563eb'
    },
    {
      id: 'jubilation',
      name: 'Jubilation XXV',
      sub: 'Royal Sultan Reserve',
      concentration: 'Eau de Parfum',
      retail: 395,
      dcltrPrice: 175,
      fill: '50ml / 100ml (50% Partial)',
      accords: ['Blackberry', 'Frankincense', 'Honey', 'Oud', 'Guaiac Wood'],
      top: 'Blackberry, Frankincense, Orange, Labdanum',
      heart: 'Honey, Bay Leaf, Cinnamon, Orchid, Clove',
      base: 'Opoponax, Agarwood, Cedarwood, Musk, Ambergris',
      batch: '#25J90 (Vintage Formulation)',
      color: '#d97706'
    },
    {
      id: 'reflection',
      name: 'Reflection 45',
      sub: 'Aromatic Pure Iris Extrait',
      concentration: 'Extrait de Parfum (45%)',
      retail: 540,
      dcltrPrice: 245,
      fill: '90ml / 100ml (90% Full)',
      accords: ['Iris', 'Neroli', 'Pink Pepper', 'Vetiver', 'Cedarwood'],
      top: 'Benzoin, Pink Peppercorn, Clary Sage, Lavender',
      heart: 'Jasmine, Neroli, Orris, Angelica Seed',
      base: 'Frankincense, Myrrh, Patchouli, Vetiver, Sandalwood',
      batch: '#45R22 (Extrait Batch)',
      color: '#64748b'
    },
    {
      id: 'overture',
      name: 'Overture Man',
      sub: 'Cognac & Aged Woods',
      concentration: 'Eau de Parfum',
      retail: 395,
      dcltrPrice: 165,
      fill: '45ml / 100ml (45% Partial)',
      accords: ['Cognac', 'Myrrh', 'Sandalwood', 'Cardamom', 'Cumin'],
      top: 'Grapefruit, Cardamom, Cumin, Ginger, Nutmeg, Saffron, Cognac',
      heart: 'Cinnamon, Lentisque, Benzoin, Labdanum, Patchouli, Geranium, Myrrh',
      base: 'Sandalwood, Smoked Leather, Clary Sage, Animalic Accords, Incense',
      batch: '#OV883 (Discontinued Bottle)',
      color: '#c2410c'
    }
  ];

  const currentEd = editions.find(e => e.id === activeEdition) || editions[0];

  const storyStages = [
    {
      id: 0,
      tag: '01 / ARCHITECTURAL MONOLITH',
      title: 'Forged in Muscat. Re-imagined in the Vault.',
      subtitle: 'The royal architectural silhouette inspired by the Sultan Qaboos dome.',
      body: 'Amouage flacons are sculpted from heavyweight optical crystal, bearing a 24-karat gold sunburst insignia and magnetic mosque dome cap. When fragrance collectors acquire partial flacons on dcltr.in, they unlock this sovereign craftsmanship at fair secondary market pricing.'
    },
    {
      id: 1,
      tag: '02 / ANATOMICAL DECONSTRUCTION',
      title: 'Engineered for Eternity. Every Component Tested.',
      subtitle: 'Explode the flacon to inspect the precision ultrasonic atomizer and fluid meniscus.',
      body: 'Every consigned Amouage lot on dcltr.in undergoes physical and photographic disassembly: verifying the magnetic 1.4Nm torque collar, ultrasonic 0.07ml pump mechanism, optical liquid line, and laser-etched manufacturer batch codes.'
    },
    {
      id: 2,
      tag: '03 / OLFACTORY FREQUENCY',
      title: 'High-Concentration Maceration & Sillage.',
      subtitle: 'Up to 53% pure fragrance oil macerated for six months.',
      body: 'From Oman frankincense harvested in the Dhofar desert to aged agarwood smoke and Macedonian orris. Experience high-octane longevity and sillage with 100% verified authentic liquid line preservation.'
    },
    {
      id: 3,
      tag: '04 / THE DCLTR EXCHANGE MATRIX',
      title: 'Why Buy Full Retail When You Can Trade Partials?',
      subtitle: 'Save up to 60% with complete 48-Hour Escrow Protection.',
      body: 'Fragrance lovers often use only 20-30ml before their taste evolves. dcltr.in empowers you to acquire verified partial bottles—or declutter your own vanity—with instant buyer escrow protection.'
    }
  ];

  const currentStage = storyStages[activeStoryStage];

  const handleStageSelect = (idx) => {
    setActiveStoryStage(idx);
    if (idx === 1) {
      setExplosionSlider(0.85); // Automatically expand exploded view
    } else {
      setExplosionSlider(0);
    }
  };

  const scrollToExchange = () => {
    document.getElementById('exchange-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-white via-gray-50/60 to-gray-100/70 text-gray-900 border-b border-gray-200 overflow-hidden py-10 lg:py-16">
      
      {/* Background Soft Ambient Light Gradients */}
      <div 
        className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none opacity-25 transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${currentEd.color} 0%, transparent 70%)` }}
      />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-purple-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Apple Keynote Stage Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold tracking-tight text-purple-800 mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>THE AMOUAGE ARCHIVE • INTERACTIVE KEYNOTE STORYTELLING</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900">
              Sovereign Perfumery. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600">
                Deconstructed & Verified.
              </span>
            </h2>
          </div>

          {/* Apple-style Segmented Story Navigation Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            {storyStages.map((st, i) => (
              <button
                key={st.id}
                onClick={() => handleStageSelect(i)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeStoryStage === i
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{st.tag.split('/')[1]?.trim() || `0${i + 1}`}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Showcase Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Dynamic Interactive Narrative & Formulations */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Stage Title & Body */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                {currentStage.tag}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {currentStage.title}
              </h3>
              <p className="text-sm font-bold text-amber-700">
                {currentStage.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                {currentStage.body}
              </p>
            </div>

            {/* Stage 1: Exploded View Anatomy Controller */}
            {activeStoryStage === 1 && (
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600" /> Anatomical Deconstruction Slider
                  </span>
                  <span className="text-purple-700 font-extrabold">{Math.round(explosionSlider * 100)}% Exploded</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={explosionSlider}
                  onChange={(e) => setExplosionSlider(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="grid grid-cols-2 gap-2.5 text-[11px] text-gray-700 pt-2 border-t border-gray-100 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>24K Gold Mosque Dome Cap</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>0.07ml Ultrasonic Micro-Pump</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Optical Beveled Crystal Flacon</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>53% Extrait Pure Maceration</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 2: Olfactory Pyramid Spectrum */}
            {activeStoryStage === 2 && (
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3 text-xs">
                <div className="font-bold text-purple-700 uppercase tracking-wider text-xs">
                  {currentEd.name} • Olfactory Pyramid Architecture
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                    <span className="text-amber-800 font-bold block text-[10px] uppercase">Top Notes (Opening Ignition):</span>
                    <span className="text-gray-900 font-medium">{currentEd.top}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80">
                    <span className="text-purple-800 font-bold block text-[10px] uppercase">Heart Notes (Resinous Soul):</span>
                    <span className="text-gray-900 font-medium">{currentEd.heart}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-100 border border-gray-200">
                    <span className="text-gray-700 font-bold block text-[10px] uppercase">Base Notes (48-Hour Residual Sillage):</span>
                    <span className="text-gray-900 font-medium">{currentEd.base}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 3: Exchange Value Comparison Matrix */}
            {activeStoryStage === 3 && (
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Secondary Exchange Telemetry ({currentEd.name})</div>
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Retail MSRP</div>
                    <div className="text-sm font-bold text-gray-400 line-through mt-0.5">{formatPrice(currentEd.retail)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <div className="text-[10px] text-purple-700 uppercase font-bold">dcltr.in Price</div>
                    <div className="text-base font-extrabold text-purple-900 mt-0.5">{formatPrice(currentEd.dcltrPrice)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-[10px] text-emerald-700 uppercase font-bold">Capital Saved</div>
                    <div className="text-base font-extrabold text-emerald-800 mt-0.5">+{formatPrice(currentEd.retail - currentEd.dcltrPrice)}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-between pt-1">
                  <span>Batch: <strong className="text-gray-900">{currentEd.batch}</strong></span>
                  <span className="text-emerald-700 font-bold">Includes 48-Hour Escrow</span>
                </div>
              </div>
            )}

            {/* Edition Selector Bar */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Select Amouage Formulation:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {editions.map(ed => (
                  <button
                    key={ed.id}
                    onClick={() => setActiveEdition(ed.id)}
                    className={`p-3 rounded-2xl border text-left transition-all text-xs ${
                      activeEdition === ed.id
                        ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-extrabold truncate">{ed.name}</div>
                    <div className="text-[11px] text-gray-500 font-semibold">{formatPrice(ed.dcltrPrice)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToExchange}
                className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2"
              >
                <span>Acquire Verified Amouage Lots</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveModal('sellWizard')}
                className="px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold text-xs shadow-sm transition-all"
              >
                + Consign Your Flacon
              </button>
            </div>

          </div>

          {/* Right Column: 3D Interactive Amouage Flacon Simulation (Light Studio Pedestal) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl bg-white border border-gray-200 shadow-xl p-4 sm:p-6 overflow-hidden">
              
              {/* Header inside 3D Pedestal */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-extrabold text-gray-800 uppercase tracking-wider text-[11px]">
                    3D Amouage CAD Simulator
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Drag 360° • Rotate & Spray
                </span>
              </div>

              {/* 3D WebGL Perfume Bottle Canvas */}
              <AmouageBottle3D
                activeChapter={activeStoryStage}
                explosionProgress={explosionSlider}
                edition={activeEdition}
                interactive={true}
                onSprayTrigger={() => setSprayCount(prev => prev + 1)}
              />

              {/* Pedestal Telemetry Strip */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Escrow Verified Lot</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-800 font-bold">{currentEd.fill}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
