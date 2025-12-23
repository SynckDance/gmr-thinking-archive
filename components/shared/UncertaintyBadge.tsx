'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UncertaintyLevel, BodyConfidence } from '@/lib/types';

interface UncertaintyBadgeProps {
  level: UncertaintyLevel;
  flags?: string[];
  confidence?: BodyConfidence;
  notes?: string;
  onLedgerClick?: () => void;
}

const levelConfig: Record<UncertaintyLevel, { bars: number; color: string; label: string }> = {
  low: { bars: 1, color: '#7eb77f', label: 'Low Uncertainty' },
  moderate: { bars: 2, color: '#d4a373', label: 'Moderate Uncertainty' },
  high: { bars: 3, color: '#9d8189', label: 'High Uncertainty' },
};

export function UncertaintyBadge({
  level,
  flags = [],
  confidence,
  notes,
  onLedgerClick,
}: UncertaintyBadgeProps) {
  const [showLedger, setShowLedger] = useState(false);
  const config = levelConfig[level];

  const handleClick = () => {
    if (onLedgerClick) {
      onLedgerClick();
    } else {
      setShowLedger(!showLedger);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-[#1f1f1f] border border-[#333]
          transition-all duration-200
          hover:border-[#555] hover:scale-105
          cursor-pointer
        "
        title={config.label}
      >
        <div className="flex items-end gap-0.5 h-3">
          {[1, 2, 3].map((bar) => (
            <div
              key={bar}
              className="w-1 rounded-sm transition-all duration-200"
              style={{
                height: `${bar * 4}px`,
                backgroundColor: bar <= config.bars ? config.color : '#333',
              }}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-[#a0a0a0] uppercase">
          {level}
        </span>
      </button>

      <AnimatePresence>
        {showLedger && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 z-50 min-w-[320px]"
          >
            <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-4 shadow-xl">
              <h4 className="font-display text-lg text-[#9d8189] mb-3">
                Uncertainty Ledger
              </h4>

              {/* Detected Flags */}
              {flags.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs text-[#666] uppercase tracking-wider mb-2">
                    Detected Conditions
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {flags.map((flag) => (
                      <span
                        key={flag}
                        className="px-2 py-1 rounded text-xs bg-[#9d8189]/20 text-[#9d8189]"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence by Region */}
              {confidence && (
                <div className="mb-4">
                  <h5 className="text-xs text-[#666] uppercase tracking-wider mb-2">
                    Confidence by Region
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(confidence).map(([region, value]) => (
                      <div key={region} className="flex items-center gap-3">
                        <span className="w-12 text-xs text-[#a0a0a0] capitalize">
                          {region}
                        </span>
                        <div className="flex-1 h-2 bg-[#333] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${value}%`,
                              backgroundColor:
                                value >= 80 ? '#7eb77f' : value >= 50 ? '#d4a373' : '#9d8189',
                            }}
                          />
                        </div>
                        <span className="w-10 text-xs text-[#666] text-right">
                          {value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contributor Notes */}
              {notes && (
                <div>
                  <h5 className="text-xs text-[#666] uppercase tracking-wider mb-2">
                    Contributor Notes
                  </h5>
                  <p className="text-sm text-[#a0a0a0] italic leading-relaxed">
                    &ldquo;{notes}&rdquo;
                  </p>
                </div>
              )}

              {/* Empty State */}
              {flags.length === 0 && !confidence && !notes && (
                <p className="text-sm text-[#666] italic">
                  No uncertainty data recorded
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UncertaintyBadge;
