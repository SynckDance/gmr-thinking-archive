'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TwinBodyPlayer } from '@/components/session/TwinBodyPlayer';
import { RecordnessPanel } from '@/components/session/RecordnessPanel';
import { DerivativesLineage } from '@/components/session/DerivativesLineage';
import { AuthorityBadge } from '@/components/shared/AuthorityBadge';
import { UncertaintyBadge } from '@/components/shared/UncertaintyBadge';
import type { ReplicationSession, UncertaintyLevel } from '@/lib/types';

// Mock session data for demonstration
const mockSession: ReplicationSession = {
  id: 'demo-session-001',
  createdAt: new Date('2024-12-20'),
  updatedAt: new Date('2024-12-23'),
  contributorId: 'user_123',
  status: 'deposited',
  provenance: {
    role: 'own',
    sentence: 'This is my original choreography, developed over three years of practice in West African contemporary dance.',
  },
  intent: {
    purposes: ['documentation', 'preservation', 'sharing'],
    sentence: 'I am recording this to preserve the movement vocabulary I have developed and share it with future researchers.',
  },
  context: {
    narrative: 'This piece explores the intersection of traditional Yoruba movement and contemporary urban dance forms. It was created during a residency in Lagos.',
    setting: 'studio',
    function: 'practice',
    constraints: ['space', 'floor'],
    futureNote: 'Please approach this work with respect for its cultural origins and the communities that inspired it.',
  },
  communityAuthority: {
    type: 'own',
    restrictions: [],
  },
  apparatus: {
    device: 'iPhone 15 Pro',
    browser: 'Safari Mobile 17.2',
    cameraPosition: 'front',
    bodyVisibility: 'full',
    notes: 'Natural lighting from large windows. Slight echo in the space.',
  },
  authorityVersions: [
    {
      version: 1,
      timestamp: new Date('2024-12-20'),
      changedBy: 'user_123',
      evidenceVisibility: 'community',
      computedVisibility: 'public',
      derivativesPermission: 'community',
      downloadsPermission: 'restricted',
    },
  ],
  currentAuthorityVersion: 1,
  evidentiaryBody: {
    videoUrl: '/demo-video.mp4',
  },
  computableBody: {
    poseDataUrl: '/demo-pose.json',
    frameCount: 1800,
  },
  uncertainty: {
    flags: ['partial_occlusion', 'variable_lighting'],
    confidence: { head: 95, torso: 88, arms: 75, legs: 82 },
    notes: 'Arms sometimes move out of frame during expansive gestures.',
  },
  interpretiveSeed: 'This movement is about the tension between roots and flight — the pull of ancestral memory and the push toward new expressions.',
  derivatives: [],
};

// Calculate uncertainty level from confidence scores
function calculateUncertaintyLevel(confidence: { head: number; torso: number; arms: number; legs: number }): UncertaintyLevel {
  const avg = (confidence.head + confidence.torso + confidence.arms + confidence.legs) / 4;
  if (avg >= 80) return 'low';
  if (avg >= 50) return 'moderate';
  return 'high';
}

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<ReplicationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recordness' | 'derivatives'>('recordness');

  useEffect(() => {
    // In production, fetch from Supabase
    // For now, use mock data
    const fetchSession = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSession({ ...mockSession, id: sessionId });
      setLoading(false);
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-[#d4a373] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-[#9d8189] mb-4">Session Not Found</h1>
          <Link href="/archive" className="text-[#d4a373] hover:underline">
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  const uncertaintyLevel = calculateUncertaintyLevel(session.uncertainty.confidence);
  const currentAuthority = session.authorityVersions.find(
    (v) => v.version === session.currentAuthorityVersion
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back Link */}
            <Link
              href="/archive"
              className="flex items-center gap-2 text-[#a0a0a0] hover:text-[#f5f5f5] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Archive</span>
            </Link>

            {/* Session ID */}
            <div className="text-center">
              <span className="font-mono text-xs text-[#666]">SESSION</span>
              <h1 className="font-mono text-sm text-[#d4a373]">{session.id}</h1>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3">
              <AuthorityBadge
                tier={currentAuthority?.evidenceVisibility || 'private'}
                version={session.currentAuthorityVersion}
                history={session.authorityVersions}
              />
              <UncertaintyBadge
                level={uncertaintyLevel}
                flags={session.uncertainty.flags}
                confidence={session.uncertainty.confidence}
                notes={session.uncertainty.notes}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Twin Body Player */}
        <section className="mb-8">
          <TwinBodyPlayer
            videoUrl={session.evidentiaryBody.videoUrl}
            poseData={[]}
            synced={true}
          />
        </section>

        {/* Session Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1f1f1f] rounded-lg p-4 border border-[#333]">
            <span className="text-xs text-[#666] uppercase tracking-wider">Contributor</span>
            <p className="text-[#f5f5f5] mt-1">{session.contributorId}</p>
          </div>
          <div className="bg-[#1f1f1f] rounded-lg p-4 border border-[#333]">
            <span className="text-xs text-[#666] uppercase tracking-wider">Deposited</span>
            <p className="text-[#f5f5f5] mt-1">{session.createdAt.toLocaleDateString()}</p>
          </div>
          <div className="bg-[#1f1f1f] rounded-lg p-4 border border-[#333]">
            <span className="text-xs text-[#666] uppercase tracking-wider">Frame Count</span>
            <p className="text-[#f5f5f5] mt-1">{session.computableBody.frameCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#333] mb-6">
          <button
            onClick={() => setActiveTab('recordness')}
            className={`
              px-6 py-3 font-mono text-sm uppercase tracking-wider
              transition-colors border-b-2 -mb-[2px]
              ${activeTab === 'recordness'
                ? 'text-[#d4a373] border-[#d4a373]'
                : 'text-[#666] border-transparent hover:text-[#a0a0a0]'
              }
            `}
          >
            Recordness
          </button>
          <button
            onClick={() => setActiveTab('derivatives')}
            className={`
              px-6 py-3 font-mono text-sm uppercase tracking-wider
              transition-colors border-b-2 -mb-[2px]
              ${activeTab === 'derivatives'
                ? 'text-[#9d8189] border-[#9d8189]'
                : 'text-[#666] border-transparent hover:text-[#a0a0a0]'
              }
            `}
          >
            Derivatives
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'recordness' && <RecordnessPanel session={session} />}
          {activeTab === 'derivatives' && (
            <DerivativesLineage
              derivatives={session.derivatives}
              currentAuthorityVersion={session.currentAuthorityVersion}
            />
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-xs text-[#666]">
            <span>GMR Thinking Archive</span>
            <span>This is a record, not a reproduction</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
