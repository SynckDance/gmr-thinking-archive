'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthorityBadge } from '@/components/shared/AuthorityBadge';
import type { VisibilityTier } from '@/lib/types';

// Mock data
interface FieldSession {
  id: string;
  title: string;
  status: 'draft' | 'deposited' | 'review';
  updatedAt: Date;
  tier: VisibilityTier;
  version: number;
  hasNewDerivatives?: boolean;
  hasAuthorityChange?: boolean;
}

const mockSessions: FieldSession[] = [
  {
    id: 'session-001',
    title: 'Morning Practice - Isolation Series',
    status: 'deposited',
    updatedAt: new Date('2024-12-22'),
    tier: 'community',
    version: 2,
    hasNewDerivatives: true,
  },
  {
    id: 'session-002',
    title: 'Workshop Documentation',
    status: 'draft',
    updatedAt: new Date('2024-12-21'),
    tier: 'private',
    version: 1,
  },
  {
    id: 'session-003',
    title: 'Collaboration with M. Rivera',
    status: 'review',
    updatedAt: new Date('2024-12-18'),
    tier: 'invited',
    version: 1,
    hasAuthorityChange: true,
  },
  {
    id: 'session-004',
    title: 'Solo Improvisation Study',
    status: 'deposited',
    updatedAt: new Date('2024-12-15'),
    tier: 'public',
    version: 3,
  },
];

type StatusFilter = 'all' | 'draft' | 'deposited' | 'review';

const statusConfig = {
  draft: { label: 'In Progress', color: 'text-[#666]', bg: 'bg-[#333]' },
  deposited: { label: 'Deposited', color: 'text-[#7eb77f]', bg: 'bg-[#7eb77f]/20' },
  review: { label: 'Awaiting Review', color: 'text-[#d4a373]', bg: 'bg-[#d4a373]/20' },
};

export default function FieldDashboard() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredSessions = mockSessions.filter(
    (s) => statusFilter === 'all' || s.status === statusFilter
  );

  const stats = {
    total: mockSessions.length,
    drafts: mockSessions.filter((s) => s.status === 'draft').length,
    deposited: mockSessions.filter((s) => s.status === 'deposited').length,
    review: mockSessions.filter((s) => s.status === 'review').length,
  };

  const returnLensSessions = mockSessions.filter(
    (s) => s.hasNewDerivatives || s.hasAuthorityChange
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#d4a373] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#d4a373]" />
              </div>
              <span className="font-display text-xl text-[#f5f5f5]">My Field</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/archive" className="text-sm text-[#a0a0a0] hover:text-[#d4a373] transition-colors">
                Archive
              </Link>
              <Link href="/lab" className="text-sm text-[#a0a0a0] hover:text-[#d4a373] transition-colors">
                Lab
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display text-[#f5f5f5] mb-2">
              Welcome back
            </h1>
            <p className="text-[#a0a0a0]">
              Manage your movement sessions and track contributions.
            </p>
          </div>
          <Link
            href="/field/portal"
            className="
              inline-flex items-center gap-2 px-6 py-3
              bg-[#d4a373] text-[#0d0d0d] rounded-lg
              font-medium hover:bg-[#e5b484] transition-colors
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Sessions" value={stats.total} />
          <StatCard label="In Progress" value={stats.drafts} color="text-[#666]" />
          <StatCard label="Deposited" value={stats.deposited} color="text-[#7eb77f]" />
          <StatCard label="Awaiting Review" value={stats.review} color="text-[#d4a373]" />
        </div>

        {/* Return Lens */}
        {returnLensSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-display text-[#9d8189] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Return Lens
            </h2>
            <div className="grid gap-3">
              {returnLensSessions.map((session) => (
                <Link key={session.id} href={`/archive/session/${session.id}`}>
                  <div className="
                    bg-[#9d8189]/10 border border-[#9d8189]/30 rounded-lg p-4
                    hover:border-[#9d8189]/60 transition-colors cursor-pointer
                  ">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[#f5f5f5]">{session.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          {session.hasNewDerivatives && (
                            <span className="text-[#d4a373]">New derivatives available</span>
                          )}
                          {session.hasAuthorityChange && (
                            <span className="text-[#9d8189]">Authority change requested</span>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Session List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-[#f5f5f5]">Your Sessions</h2>
            <div className="flex gap-1">
              {(['all', 'draft', 'deposited', 'review'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`
                    px-3 py-1 rounded text-xs font-mono uppercase
                    transition-colors
                    ${statusFilter === status
                      ? 'bg-[#d4a373] text-[#0d0d0d]'
                      : 'bg-[#1f1f1f] text-[#a0a0a0] hover:bg-[#333]'
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={
                    session.status === 'draft'
                      ? `/field/portal?resume=${session.id}`
                      : `/archive/session/${session.id}`
                  }
                >
                  <div className="
                    bg-[#1f1f1f] rounded-lg border border-[#333] p-5
                    hover:border-[#d4a373]/50 transition-all cursor-pointer
                  ">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-[#f5f5f5]">{session.title}</h3>
                          <span className={`
                            px-2 py-0.5 rounded text-xs
                            ${statusConfig[session.status].bg}
                            ${statusConfig[session.status].color}
                          `}>
                            {statusConfig[session.status].label}
                          </span>
                        </div>
                        <p className="text-sm text-[#666]">
                          Last updated {session.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <AuthorityBadge tier={session.tier} version={session.version} />
                        <svg className="w-5 h-5 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#666]">No sessions match this filter.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-xs text-[#666]">
            <span>GMR Thinking Archive</span>
            <span>Your contributions shape the archive</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = 'text-[#f5f5f5]',
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-[#1f1f1f] rounded-lg border border-[#333] p-4">
      <p className="text-xs text-[#666] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-display ${color}`}>{value}</p>
    </div>
  );
}
