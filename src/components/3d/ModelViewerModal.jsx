import React from 'react';
import { X, Sparkles, ShieldCheck, Box, Wind, RotateCw, Eye } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import RealPerfumeModel3D from './RealPerfumeModel3D';

export default function ModelViewerModal() {
  const { activeModal, setActiveModal } = useMarketplace();

  if (activeModal !== 'modelViewer') return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl p-6 bg-white text-gray-900 shadow-2xl my-8 border border-gray-100 flex flex-col space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                3D CAD Flacon Inspection Studio
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Real-time 3D rendered geometry • Fluid Meniscus • Atomizer Mist Simulation
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D GLB Model Viewport */}
        <div className="w-full">
          <RealPerfumeModel3D
            modelUrl="/models/perfume.glb"
            height="520px"
            interactive={true}
            autoRotate={true}
          />
        </div>

        {/* Inspection Specifications Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Asset Source</div>
            <div className="font-extrabold text-gray-900 mt-0.5">High-Poly 3D Master CAD (`perfume.glb`)</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
            <div className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">Interactive Controls</div>
            <div className="font-bold text-purple-950 mt-0.5">360° Drag Orbit • Mouse Wheel Zoom • Atomizer Spray</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Provenance Guarantee</div>
            <div className="font-bold text-emerald-950 mt-0.5">100% Escrow Verified Before Release</div>
          </div>
        </div>

      </div>
    </div>
  );
}
