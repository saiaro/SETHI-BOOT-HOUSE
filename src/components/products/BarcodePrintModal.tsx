import React, { useState } from 'react';
import { X, Printer } from 'lucide-react';
import { Product, ProductVariant } from '../../types/database';

interface BarcodePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export const BarcodePrintModal: React.FC<BarcodePrintModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(product?.variants[0]?.id || '');
  const [labelCopies, setLabelCopies] = useState<number>(4);

  if (!isOpen || !product) return null;

  const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="print:hidden flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Print Shoe Box Barcode Stickers</h3>
            <p className="text-xs text-slate-500">{product.name} ({product.brand})</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded bg-blue-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-800"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Stickers</span>
            </button>
            <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-200">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Options Toolbar (Hidden on Print) */}
        <div className="print:hidden border-b border-slate-200 bg-white p-4 flex flex-wrap gap-4 items-center text-xs">
          <div>
            <label className="font-bold text-slate-700 mr-2">Select Variant:</label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="rounded border border-slate-300 py-1 px-2.5 bg-white font-medium"
            >
              {product.variants.map(v => (
                <option key={v.id} value={v.id}>
                  Size {v.size} ({v.color}) - SKU: {v.sku} - MRP ₹{v.mrp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 mr-2">Number of Labels:</label>
            <input
              type="number"
              min="1"
              max="24"
              value={labelCopies}
              onChange={(e) => setLabelCopies(Math.max(1, Number(e.target.value)))}
              className="w-16 rounded border border-slate-300 py-1 px-2 text-center font-bold"
            />
          </div>
        </div>

        {/* Stickers Sheet Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg bg-white p-4 border border-slate-300 shadow-sm print:border-none print:shadow-none print:p-0">
            {Array.from({ length: labelCopies }).map((_, idx) => (
              <div
                key={idx}
                className="rounded border border-dashed border-slate-400 p-2 text-center text-slate-900 font-mono text-[10px] leading-tight space-y-1 bg-white"
              >
                <p className="font-extrabold uppercase text-[11px] text-blue-950">SETHI BOOT HOUSE</p>
                <p className="text-[10px] text-slate-600">RATIA (HARYANA)</p>
                <div className="border-t border-slate-300 pt-1">
                  <p className="font-bold truncate text-[11px]">{product.brand} - {product.name}</p>
                  <p className="font-extrabold text-xs text-blue-900">
                    SIZE: {currentVariant.size} UK • {currentVariant.color}
                  </p>
                </div>

                {/* Simulated High-Res Barcode SVG */}
                <div className="py-1 flex flex-col items-center">
                  <div className="h-9 w-40 flex items-stretch justify-center gap-0.5">
                    {currentVariant.barcode.split('').map((char, cIdx) => {
                      const num = parseInt(char, 10) || 1;
                      return (
                        <div
                          key={cIdx}
                          className="bg-black"
                          style={{
                            width: num % 2 === 0 ? '3px' : '1.5px',
                            opacity: (num + cIdx) % 3 === 0 ? 0.3 : 1
                          }}
                        />
                      );
                    })}
                  </div>
                  <span className="font-mono text-[10px] font-bold tracking-widest mt-0.5">
                    {currentVariant.barcode}
                  </span>
                </div>

                <div className="border-t border-slate-300 pt-1 flex justify-between items-center px-1 font-bold">
                  <span className="text-slate-500 line-through text-[10px]">MRP ₹{currentVariant.mrp}</span>
                  <span className="text-xs text-slate-900">OUR PRICE: ₹{currentVariant.sellingPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
