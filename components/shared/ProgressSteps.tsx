'use client';

import { motion } from 'framer-motion';

interface Step {
  number: number;
  title: string;
  completed: boolean;
  current: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full">
      {/* Mobile: Compact indicator */}
      <div className="md:hidden flex items-center justify-center gap-2 mb-4">
        <span className="text-[#d4a373] font-mono text-sm">
          Step {currentStep + 1}
        </span>
        <span className="text-[#666]">/</span>
        <span className="text-[#666] font-mono text-sm">{steps.length}</span>
      </div>

      {/* Desktop: Full progress bar */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-[#333]" />

        {/* Progress line active */}
        <motion.div
          className="absolute left-0 top-4 h-0.5 bg-[#d4a373]"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Step indicators */}
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative flex flex-col items-center z-10"
          >
            <motion.div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                font-mono text-xs
                transition-colors duration-300
                ${
                  step.completed
                    ? 'bg-[#d4a373] text-[#0d0d0d]'
                    : step.current
                    ? 'bg-[#d4a373]/20 text-[#d4a373] border-2 border-[#d4a373]'
                    : 'bg-[#1f1f1f] text-[#666] border border-[#333]'
                }
              `}
              animate={step.current ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: step.current ? Infinity : 0, repeatDelay: 2 }}
            >
              {step.completed ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </motion.div>
            <span
              className={`
                mt-2 text-xs font-mono uppercase tracking-wider
                ${step.current ? 'text-[#d4a373]' : 'text-[#666]'}
              `}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressSteps;
