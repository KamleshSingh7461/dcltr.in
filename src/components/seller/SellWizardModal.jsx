import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import BottleLevelIndicator from '../ui/BottleLevelIndicator';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export default function SellWizardModal() {
  const {
    activeModal,
    setActiveModal,
    masterCatalog,
    createListing,
    showToast
  } = useMarketplace();

  const [step, setStep] = useState(1);

  // Form State
  const [selectedMaster, setSelectedMaster] = useState(masterCatalog[0]);
  const [customBrand, setCustomBrand] = useState('');
  const [customName, setCustomName] = useState('');
  const [concentration, setConcentration] = useState('Eau de Parfum');
  const [originalCapacityMl, setOriginalCapacityMl] = useState(100);
  const [remainingMl, setRemainingMl] = useState(75);
  const [packagingType, setPackagingType] = useState('retail_with_box'); // 'retail_with_box' | 'retail_without_box' | 'tester_with_box' | 'tester_without_box'
  const [hasCap, setHasCap] = useState(true);
  const [isSealed, setIsSealed] = useState(false);
  const [batchCode, setBatchCode] = useState('21099');
  const [productionYear, setProductionYear] = useState(2021);
  const [price, setPrice] = useState(175);
  const [acceptsOffers, setAcceptsOffers] = useState(true);
  const [minimumOffer, setMinimumOffer] = useState(140);
  const [description, setDescription] = useState('Stored carefully in temperature-controlled dark wardrobe. Sprayed only a handful of times.');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    masterCatalog[0]?.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'
  );

  useBodyScrollLock(activeModal === 'sellWizard');

  if (activeModal !== 'sellWizard') return null;

  // Compute partial bracket
  const fillPct = Math.round((remainingMl / originalCapacityMl) * 100);
  const conditionTier = isSealed || fillPct === 100 
    ? 'Brand New (100% Sealed)' 
    : fillPct <= 30 
    ? `Low Partial (${fillPct}%)` 
    : fillPct <= 70 
    ? `Mid Partial (${fillPct}%)` 
    : `High Partial (${fillPct}%)`;
  const condition = conditionTier;
  const hasOriginalBox = packagingType.includes('with_box');

  const handleMasterSelect = (master) => {
    setSelectedMaster(master);
    setUploadedImageUrl(master.image);
    setConcentration(master.concentration);
    setOriginalCapacityMl(master.retailSizes[0] || 100);
    setRemainingMl(Math.round((master.retailSizes[0] || 100) * 0.75));
    setPrice(Math.round((master.retailPrice100ml || 300) * 0.65));
  };

  const handleCapacityChange = (cap) => {
    setOriginalCapacityMl(cap);
    if (remainingMl > cap) setRemainingMl(cap);
  };

  const handleLevelSlider = (val) => {
    setRemainingMl(val);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const brand = selectedMaster ? selectedMaster.brand : (customBrand || 'Niche House');
    const name = selectedMaster ? selectedMaster.name : (customName || 'Private Blend');

    const isTester = packagingType.includes('tester');
    const packagingLabel = isTester 
      ? (hasOriginalBox ? 'Retail Tester with box' : 'Retail Tester without box')
      : (hasOriginalBox ? 'Retail with box' : 'Retail without box');

    const listingPayload = {
      masterId: selectedMaster ? selectedMaster.id : 'custom',
      title: `${brand} ${name} - ${remainingMl}ml / ${originalCapacityMl}ml (${packagingLabel})`,
      brand,
      name,
      concentration,
      originalCapacityMl,
      remainingMl,
      fillPercentage: fillPct,
      condition: conditionTier,
      conditionBadge: `${remainingMl}ml (${fillPct}% Full)`,
      isSealed,
      isTester,
      hasOriginalBox,
      price: Number(price),
      retailMsrp: selectedMaster?.retailPrice100ml || Math.round(price * 1.5),
      batchCode: batchCode.toUpperCase(),
      productionYear: Number(productionYear),
      presentation: packagingLabel,
      hasCap,
      juiceColor: '#D4AF37',
      image: uploadedImageUrl,
      verificationImages: [uploadedImageUrl],
      seller: {
        id: 'seller-you',
        name: 'You (Collector)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        rating: 5.0,
        salesCount: 1,
        isVerifiedSeller: true,
        memberSince: '2026',
        responseRate: '100%'
      },
      authenticityStatus: 'Pending Escrow Inspection',
      escrowProtected: true,
      accords: selectedMaster?.accords || ['Woody', 'Amber', 'Citrus'],
      topNotes: selectedMaster?.topNotes || ['Bergamot'],
      heartNotes: selectedMaster?.heartNotes || ['Spices'],
      baseNotes: selectedMaster?.baseNotes || ['Vanilla', 'Ambergris'],
      description,
      location: 'New York, USA',
      shippingCost: 0,
      acceptsOffers,
      minimumOffer: acceptsOffers ? Number(minimumOffer) : null
    };

    createListing(listingPayload);
    setActiveModal(null);
  };

  const pricePerMl = (price / remainingMl).toFixed(2);

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="relative w-full max-w-3xl rounded-3xl p-6 sm:p-8 bg-white text-gray-900 shadow-2xl my-8 border border-gray-100">
        
        {/* Close */}
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Stepper */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            LIST A FRAGRANCE FOR SALE
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Create a Verified Fragrance Listing
          </h2>

          {/* Stepper */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs font-semibold">
            {[
              { num: 1, label: '1. Select Scent' },
              { num: 2, label: '2. Fill & Box' },
              { num: 3, label: '3. Batch Code' },
              { num: 4, label: '4. Pricing' },
            ].map(s => (
              <div
                key={s.num}
                className={`p-2 rounded-xl text-center transition-all border ${
                  step === s.num
                    ? 'bg-gray-900 border-gray-900 text-white font-bold'
                    : step > s.num
                    ? 'bg-gray-100 border-gray-200 text-gray-700'
                    : 'bg-white border-gray-100 text-gray-400'
                }`}
              >
                <div>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Select Fragrance */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Choose from Master Database or Search
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {masterCatalog.map(master => (
                <div
                  key={master.id}
                  onClick={() => handleMasterSelect(master)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    selectedMaster?.id === master.id
                      ? 'bg-amber-50/70 border-amber-500 shadow-sm'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={master.image} alt={master.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase text-amber-700 font-extrabold">{master.brand}</div>
                    <div className="text-xs text-gray-900 truncate font-bold">{master.name}</div>
                    <div className="text-[10px] text-gray-500">{master.concentration}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-sm"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Fill Level & Box Condition */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Visual Flacon Simulation */}
            <div className="md:col-span-5 bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center">
              <BottleLevelIndicator
                remainingMl={remainingMl}
                originalCapacityMl={originalCapacityMl}
                hasCap={hasCap}
                isSealed={isSealed}
                size="lg"
                showLabels={true}
              />
              <div className="mt-4 text-center">
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200 font-mono">
                  {condition}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="md:col-span-7 space-y-4 text-xs">
              
              {/* Capacity Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Bottle Size / Capacity
                </label>
                <div className="flex flex-wrap gap-2 font-mono">
                  {[30, 50, 70, 75, 100, 125, 200, 250].map(cap => (
                    <button
                      type="button"
                      key={cap}
                      onClick={() => handleCapacityChange(cap)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                        originalCapacityMl === cap
                          ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cap} ML
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact ML Slider */}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-gray-800 mb-1 font-bold">
                  <span>Measured Remaining Volume:</span>
                  <span className="text-amber-800 font-mono">{remainingMl} ML ({Math.round((remainingMl / originalCapacityMl) * 100)}% Full)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={originalCapacityMl}
                  step="1"
                  value={remainingMl}
                  onChange={(e) => handleLevelSlider(Number(e.target.value))}
                  className="w-full accent-gray-900 cursor-pointer"
                />
              </div>

              {/* Packaging & Presentation Options */}
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Packaging & Presentation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'retail_with_box', label: 'Retail with box', sub: 'Original retail packaging' },
                    { id: 'retail_without_box', label: 'Retail without box', sub: 'Retail flacon, no box' },
                    { id: 'tester_with_box', label: 'Retail Tester with box', sub: 'Tester bottle with demo box' },
                    { id: 'tester_without_box', label: 'Retail Tester without box', sub: 'Tester bottle only' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPackagingType(opt.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        packagingType === opt.id
                          ? 'bg-gray-900 border-gray-900 text-white font-bold shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className={`text-[10px] ${packagingType === opt.id ? 'text-gray-300' : 'text-gray-400'}`}>
                        {opt.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cap Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setHasCap(!hasCap)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                    hasCap ? 'bg-amber-50 border-amber-300 text-gray-900 font-bold' : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-xs font-semibold">Cap / Stopper: {hasCap ? 'Present' : 'Missing'}</div>
                  <div className="text-[10px] text-gray-400">{hasCap ? 'Original Cap Present' : 'No Cap Included'}</div>
                </button>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-sm"
                >
                  Continue
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: Batch Code & Provenance */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Batch Code Stamp
              </label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="e.g. 19X01, A4221, 21099"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-mono uppercase focus:border-gray-900 focus:outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1">Laser engraved on the bottom of the bottle glass or box sticker.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Production Year
                </label>
                <input
                  type="number"
                  value={productionYear}
                  onChange={(e) => setProductionYear(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-mono focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Concentration
                </label>
                <select
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:border-gray-900 focus:outline-none cursor-pointer"
                >
                  <option value="Extrait de Parfum">Extrait de Parfum</option>
                  <option value="Eau de Parfum">Eau de Parfum (EDP)</option>
                  <option value="Eau de Toilette">Eau de Toilette (EDT)</option>
                  <option value="Parfum Cologne">Parfum Cologne</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Storage History & Provenance Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:border-gray-900 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-sm"
              >
                Continue to Pricing
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Pricing & Publish */}
        {step === 4 && (
          <form onSubmit={handlePublish} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Listing Summary</div>
                <div className="text-base font-bold text-gray-900 mt-0.5">
                  {selectedMaster?.brand} — {selectedMaster?.name}
                </div>
                <div className="text-[11px] text-gray-500 font-mono">
                  {remainingMl}ml / {originalCapacityMl}ml • Batch #{batchCode} • {hasOriginalBox ? 'With Box' : 'Bottle Only'}
                </div>
              </div>
              <img src={uploadedImageUrl} alt="Bottle" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Listing Valuation
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-base font-bold font-mono text-gray-900 focus:border-gray-900 focus:outline-none"
                  />
                </div>
                <div className="text-[10px] text-gray-500 mt-1 font-mono">Approx. {formatPrice(price)} ({formatPrice(Number(pricePerMl))}/ml)</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Minimum Offer Floor
                </label>
                <input
                  type="number"
                  value={minimumOffer}
                  onChange={(e) => setMinimumOffer(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-base font-bold font-mono text-gray-900 focus:border-gray-900 focus:outline-none"
                />
                <div className="text-[10px] text-gray-400 mt-1 font-mono">Floor: {formatPrice(minimumOffer)}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
              48-Hour Buyer Escrow Protection applies to this listing automatically.
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-md tracking-wider flex items-center gap-2"
              >
                <span>Publish Listing</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
