'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LabPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#7eb77f] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#7eb77f]" />
              </div>
              <span className="font-display text-xl text-[#f5f5f5]">Lab</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/archive" className="text-sm text-[#a0a0a0] hover:text-[#d4a373] transition-colors">
                Archive
              </Link>
              <Link href="/field" className="text-sm text-[#a0a0a0] hover:text-[#d4a373] transition-colors">
                Field
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Icon */}
          <motion.div
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#7eb77f]/10 border border-[#7eb77f]/30 flex items-center justify-center"
            animate={{
              boxShadow: ['0 0 0 0 rgba(126, 183, 127, 0)', '0 0 0 20px rgba(126, 183, 127, 0.1)', '0 0 0 0 rgba(126, 183, 127, 0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-12 h-12 text-[#7eb77f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-display text-[#f5f5f5] mb-4">
            Movement Lab
          </h1>
          <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-12">
            Analyze, compare, and derive insights from archived movement sessions.
          </p>

          {/* Coming Soon Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <FeatureCard
              icon="📊"
              title="QTC Analysis"
              description="Qualitative Trajectory Calculus for movement comparison"
              status="Coming Soon"
            />
            <FeatureCard
              icon="🔗"
              title="Alignment"
              description="Temporal alignment between multiple sessions"
              status="Coming Soon"
            />
            <FeatureCard
              icon="🎯"
              title="Clustering"
              description="Find patterns across the archive"
              status="Coming Soon"
            />
          </div>

          {/* Access Notice */}
          <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg text-[#f5f5f5] mb-2">Lab Access</h3>
            <p className="text-[#a0a0a0] text-sm mb-4">
              The Lab generates derivatives from archived sessions. All analysis respects
              the authority settings of the source material.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/field/portal"
                className="px-4 py-2 bg-[#d4a373] text-[#0d0d0d] rounded-lg text-sm font-medium hover:bg-[#e5b484] transition-colors"
              >
                Deposit Session First
              </Link>
              <Link
                href="/archive"
                className="px-4 py-2 bg-[#333] text-[#a0a0a0] rounded-lg text-sm font-medium hover:bg-[#444] transition-colors"
              >
                Browse Archive
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-xs text-[#666]">
            <span>GMR Thinking Archive</span>
            <span>Analysis with accountability</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  status,
}: {
  icon: string;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg text-[#f5f5f5] mb-2">{title}</h3>
      <p className="text-sm text-[#a0a0a0] mb-3">{description}</p>
      <span className="inline-block px-2 py-1 bg-[#333] text-[#666] text-xs rounded font-mono">
        {status}
      </span>
    </div>
  );
}
