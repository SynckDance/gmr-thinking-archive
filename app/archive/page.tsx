'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthorityBadge } from '@/components/shared/AuthorityBadge';
import type { VisibilityTier } from '@/lib/types';

// Mock data for demonstration
interface ArchiveSession {
  id: string;
  title: string;
  contributor: string;
  createdAt: Date;
  tier: VisibilityTier;
  version: number;
  location?: { lat: number; lng: number };
  thumbnail?: string;
}

const mockSessions: ArchiveSession[] = [
  {
    id: 'session-001',
    title: 'West African Contemporary Study',
    contributor: 'J. Adeyemi',
    createdAt: new Date('2024-12-20'),
    tier: 'public',
    version: 2,
    location: { lat: 6.5244, lng: 3.3792 },
  },
  {
    id: 'session-002',
    title: 'Urban Dance Vocabulary',
    contributor: 'M. Chen',
    createdAt: new Date('2024-12-18'),
    tier: 'community',
    version: 1,
    location: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 'session-003',
    title: 'Traditional Movement Archive',
    contributor: 'S. Okonkwo',
    createdAt: new Date('2024-12-15'),
    tier: 'private',
    version: 3,
  },
  {
    id: 'session-004',
    title: 'Contact Improvisation',
    contributor: 'A. Rivera',
    createdAt: new Date('2024-12-12'),
    tier: 'public',
    version: 1,
    location: { lat: 51.5074, lng: -0.1278 },
  },
];

type ViewMode = 'list' | 'map';
type FilterTier = 'all' | VisibilityTier;

export default function ArchivePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterTier, setFilterTier] = useState<FilterTier>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sessions
  const filteredSessions = mockSessions.filter((session) => {
    if (filterTier !== 'all' && session.tier !== filterTier) return false;
    if (searchQuery && !session.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#9d8189] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#9d8189]" />
              </div>
              <span className="font-display text-xl text-[#f5f5f5]">Archive</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/field" className="text-sm text-[#a0a0a0] hover:text-[#d4a373] transition-colors">
                Field
              </Link>
              <Link href="/lab" className="text-sm text-[#a0a0a0] hover:text-[#d4a373] transition-colors">
                Lab
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full px-4 py-2 pl-10
                  bg-[#1f1f1f] border border-[#333] rounded-lg
                  text-[#f5f5f5] placeholder-[#666]
                  focus:outline-none focus:border-[#d4a373]
                  transition-colors
                "
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Tier Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#666] uppercase tracking-wider">Tier:</span>
              <div className="flex gap-1">
                {(['all', 'public', 'community', 'private'] as FilterTier[]).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setFilterTier(tier)}
                    className={`
                      px-3 py-1 rounded text-xs font-mono uppercase
                      transition-colors
                      ${filterTier === tier
                        ? 'bg-[#d4a373] text-[#0d0d0d]'
                        : 'bg-[#1f1f1f] text-[#a0a0a0] hover:bg-[#333]'
                      }
                    `}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2 rounded transition-colors
                  ${viewMode === 'list' ? 'bg-[#d4a373] text-[#0d0d0d]' : 'bg-[#1f1f1f] text-[#a0a0a0]'}
                `}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`
                  p-2 rounded transition-colors
                  ${viewMode === 'map' ? 'bg-[#d4a373] text-[#0d0d0d]' : 'bg-[#1f1f1f] text-[#a0a0a0]'}
                `}
                title="Map View"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Stats */}
              <div className="mb-6 text-sm text-[#666]">
                Showing {filteredSessions.length} of {mockSessions.length} sessions
              </div>

              {/* Session List */}
              <div className="space-y-4">
                {filteredSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/archive/session/${session.id}`}>
                      <div className="
                        bg-[#1f1f1f] rounded-lg border border-[#333] p-6
                        hover:border-[#d4a373]/50 transition-all
                        group cursor-pointer
                      ">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg text-[#f5f5f5] font-display group-hover:text-[#d4a373] transition-colors">
                              {session.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-[#a0a0a0]">
                              <span>{session.contributor}</span>
                              <span className="text-[#666]">•</span>
                              <span>{session.createdAt.toLocaleDateString()}</span>
                              {session.location && (
                                <>
                                  <span className="text-[#666]">•</span>
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Located
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <AuthorityBadge tier={session.tier} version={session.version} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {filteredSessions.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1f1f1f] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg text-[#f5f5f5] mb-2">No sessions found</h3>
                  <p className="text-[#666]">Try adjusting your filters or search query.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[600px] rounded-lg overflow-hidden border border-[#333]"
            >
              {/* Map Placeholder */}
              <div className="w-full h-full bg-[#1f1f1f] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#333] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg text-[#f5f5f5] mb-2">Map View</h3>
                  <p className="text-[#666] text-sm mb-4">
                    Mapbox integration required.
                  </p>
                  <p className="text-xs text-[#555]">
                    Add NEXT_PUBLIC_MAPBOX_TOKEN to enable.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-xs text-[#666]">
            <span>GMR Thinking Archive</span>
            <Link href="/field/portal" className="text-[#d4a373] hover:underline">
              Deposit New Session
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
