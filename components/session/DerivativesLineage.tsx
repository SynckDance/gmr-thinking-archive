'use client';

import { motion } from 'framer-motion';
import type { Derivative } from '@/lib/types';

interface DerivativesLineageProps {
  derivatives: Derivative[];
  currentAuthorityVersion: number;
}

const typeLabels: Record<string, { label: string; icon: string }> = {
  qtc: { label: 'QTC Analysis', icon: '📊' },
  alignment: { label: 'Alignment', icon: '🔗' },
  cluster: { label: 'Cluster', icon: '🎯' },
  visualization: { label: 'Visualization', icon: '🎨' },
};

export function DerivativesLineage({
  derivatives,
  currentAuthorityVersion,
}: DerivativesLineageProps) {
  if (derivatives.length === 0) {
    return (
      <div className="bg-[#1f1f1f] rounded-lg border border-[#333] p-6">
        <h3 className="font-display text-xl text-[#9d8189] mb-4">
          Derivatives Lineage
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#333] flex items-center justify-center">
            <span className="text-2xl">🔬</span>
          </div>
          <p className="text-[#666] text-sm">
            No derivatives have been generated from this session yet.
          </p>
          <p className="text-[#555] text-xs mt-2">
            Derivatives are created through Lab analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1f1f1f] rounded-lg border border-[#333] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#333] bg-[#151515]">
        <h3 className="font-display text-xl text-[#9d8189]">
          Derivatives Lineage
        </h3>
        <p className="text-xs text-[#666] mt-1 font-mono">
          Analytic outputs generated from this session
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {derivatives.map((derivative, index) => {
            const typeInfo = typeLabels[derivative.type] || {
              label: derivative.type,
              icon: '📄',
            };
            const isCurrentAuthority =
              derivative.authorityVersionUsed === currentAuthorityVersion;

            return (
              <motion.div
                key={derivative.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative p-4 rounded-lg border
                  ${isCurrentAuthority ? 'border-[#d4a373]/40 bg-[#d4a373]/5' : 'border-[#333] bg-[#151515]'}
                `}
              >
                {/* Timeline connector */}
                {index < derivatives.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-4 bg-[#333]" />
                )}

                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{typeInfo.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#f5f5f5] font-medium">
                        {typeInfo.label}
                      </span>
                      <span
                        className={`
                          px-2 py-0.5 rounded text-xs font-mono
                          ${isCurrentAuthority
                            ? 'bg-[#d4a373]/20 text-[#d4a373]'
                            : 'bg-[#333] text-[#666]'
                          }
                        `}
                      >
                        v{derivative.authorityVersionUsed}
                      </span>
                    </div>

                    <p className="text-sm text-[#a0a0a0] mb-2">
                      {derivative.inputDescription}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#666]">
                      <span>
                        {new Date(derivative.createdAt).toLocaleDateString()}
                      </span>
                      {derivative.linkedSessions &&
                        derivative.linkedSessions.length > 0 && (
                          <span>
                            Links {derivative.linkedSessions.length} session
                            {derivative.linkedSessions.length > 1 ? 's' : ''}
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Output Link */}
                  {derivative.outputUrl && (
                    <a
                      href={derivative.outputUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        px-3 py-1.5 rounded-lg
                        bg-[#333] text-[#a0a0a0]
                        text-xs font-mono
                        hover:bg-[#444] hover:text-[#f5f5f5]
                        transition-colors
                      "
                    >
                      View Output
                    </a>
                  )}
                </div>

                {/* Authority Warning */}
                {!isCurrentAuthority && (
                  <div className="mt-3 pt-3 border-t border-[#333]">
                    <p className="text-xs text-[#9d8189] flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Created under authority version {derivative.authorityVersionUsed} (current: v{currentAuthorityVersion})
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DerivativesLineage;
