'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisibilityTier, AuthorityVersion } from '@/lib/types';

interface AuthorityBadgeProps {
  tier: VisibilityTier;
  version: number;
  history?: AuthorityVersion[];
  onHistoryClick?: () => void;
}

const tierColors: Record<VisibilityTier, { bg: string; text: string; label: string }> = {
  public: { bg: 'bg-[#7eb77f]/20', text: 'text-[#7eb77f]', label: 'PUBLIC' },
  community: { bg: 'bg-[#d4a373]/20', text: 'text-[#d4a373]', label: 'COMMUNITY' },
  invited: { bg: 'bg-[#9d8189]/20', text: 'text-[#9d8189]', label: 'INVITED' },
  private: { bg: 'bg-[#9d8189]/20', text: 'text-[#9d8189]', label: 'PRIVATE' },
};

export function AuthorityBadge({ tier, version, history, onHistoryClick }: AuthorityBadgeProps) {
  const [showHistory, setShowHistory] = useState(false);
  const colors = tierColors[tier];

  const handleClick = () => {
    if (onHistoryClick) {
      onHistoryClick();
    } else if (history && history.length > 0) {
      setShowHistory(!showHistory);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          ${colors.bg} ${colors.text}
          font-mono text-xs uppercase tracking-wider
          border border-current/20
          transition-all duration-200
          hover:border-current/40 hover:scale-105
          cursor-pointer
        `}
      >
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        <span>{colors.label}</span>
        <span className="opacity-60">v{version}</span>
      </button>

      <AnimatePresence>
        {showHistory && history && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 z-50 min-w-[300px]"
          >
            <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-4 shadow-xl">
              <h4 className="font-display text-lg text-[#d4a373] mb-3">
                Authority History
              </h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {history.map((v, i) => (
                  <div
                    key={v.version}
                    className={`
                      p-3 rounded border
                      ${i === 0 ? 'border-[#d4a373]/40 bg-[#d4a373]/5' : 'border-[#333]'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-[#a0a0a0]">
                        Version {v.version}
                      </span>
                      <span className="text-xs text-[#666]">
                        {new Date(v.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#666]">Evidence: </span>
                        <span className="text-[#f5f5f5]">{v.evidenceVisibility}</span>
                      </div>
                      <div>
                        <span className="text-[#666]">Computed: </span>
                        <span className="text-[#f5f5f5]">{v.computedVisibility}</span>
                      </div>
                      <div>
                        <span className="text-[#666]">Derivatives: </span>
                        <span className="text-[#f5f5f5]">{v.derivativesPermission}</span>
                      </div>
                      <div>
                        <span className="text-[#666]">Downloads: </span>
                        <span className="text-[#f5f5f5]">{v.downloadsPermission}</span>
                      </div>
                    </div>
                    {v.reason && (
                      <p className="mt-2 text-xs text-[#a0a0a0] italic">
                        {v.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AuthorityBadge;
