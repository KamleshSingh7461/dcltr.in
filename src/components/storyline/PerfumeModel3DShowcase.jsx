import React, { useState } from 'react';
import { 
  Sparkles, RotateCw, ZoomIn, ZoomOut, 
  Wind, ShieldCheck, Droplets, CheckCircle2, 
  ChevronDown, ChevronUp, ArrowRight, Eye, Lock
} from 'lucide-react';
import RealPerfumeModel3D from '../3d/RealPerfumeModel3D';
import { useMarketplace } from '../../context/MarketplaceContext';

export default function PerfumeModel3DShowcase() {
  const { setActiveModal, formatPrice } = useMarketplace();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 sm:p-8">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-bold text-purple-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>INTERACTIVE 3D CAD INSPECTION LAB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              3D Flacon Inspection & Atomizer Simulator
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Drag to rotate 360°, zoom in to inspect batch stamping, and test precision mist delivery.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {isExpanded ? (
                <>
                  <span>Collapse 3D Studio</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Expand 3D Studio</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expandable 3D Studio Content */}
        {isExpanded && (
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
            
            {/* Left: 3D Canvas */}
            <div className="lg:col-span-7">
              <RealPerfumeModel3D
                modelUrl="/models/perfume.glb"
                height="480px"
                interactive={true}
                autoRotate={true}
              />
            </div>

            {/* Right: Inspection Specs & Direct Action */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                  Pre-Acquisition Inspection Protocol
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  Verify Every Angle in Real-Time 3D
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Before purchasing any pre-loved bottle or rare partial on dcltr.in, our interactive 3D laboratory allows you to examine the architectural glass contours, atomizer collar fitment, and fluid volume.
                </p>
              </div>

              {/* Inspection Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                    <Droplets className="w-4 h-4 text-amber-500" />
                    <span>Fluid Line Meniscus</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Backlit precision volume inspection</div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Batch Code Stamp</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Cross-referenced with manufacturer registry</div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                    <Wind className="w-4 h-4 text-purple-600" />
                    <span>Ultrasonic Mist</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">0.07ml micro-dispersion pattern tested</div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span>48h Escrow Window</span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Funds held securely until your inspection</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    document.getElementById('exchange-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2"
                >
                  <span>Browse Exchange Inventory</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveModal('sellWizard')}
                  className="px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold text-xs transition-all"
                >
                  + List a Flacon
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
