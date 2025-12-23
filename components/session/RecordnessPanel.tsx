'use client';

import type { ReplicationSession } from '@/lib/types';

interface RecordnessPanelProps {
  session: ReplicationSession;
}

// Role display labels
const roleLabels: Record<string, string> = {
  own: 'Original Creator',
  learning: 'Learning',
  documenting: 'Documenting',
  reconstructing: 'Reconstructing',
  translating: 'Translating',
  replication: 'Replicating',
  variation: 'Creating Variation',
};

// Setting display labels
const settingLabels: Record<string, string> = {
  studio: 'Studio',
  home: 'Home',
  street: 'Street',
  club: 'Club',
  classroom: 'Classroom',
  ceremony: 'Ceremony',
  other: 'Other',
};

// Function display labels
const functionLabels: Record<string, string> = {
  practice: 'Practice',
  performance: 'Performance',
  ritual: 'Ritual',
  instruction: 'Instruction',
  social: 'Social',
  other: 'Other',
};

// Authorization display labels
const authLabels: Record<string, string> = {
  own: 'Own Material',
  permission: 'With Permission',
  public: 'Public Domain',
  sensitive: 'Culturally Sensitive',
  unsure: 'Uncertain',
};

export function RecordnessPanel({ session }: RecordnessPanelProps) {
  return (
    <div className="bg-[#1f1f1f] rounded-lg border border-[#333] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#333] bg-[#151515]">
        <h3 className="font-display text-xl text-[#d4a373]">
          Recordness
        </h3>
        <p className="text-xs text-[#666] mt-1 font-mono">
          Complete admission record for this session
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Provenance */}
        <Section title="Provenance" icon="📍">
          <div className="mb-2">
            <Label>Role</Label>
            <Value>{roleLabels[session.provenance.role] || session.provenance.role}</Value>
          </div>
          <div>
            <Label>Relationship</Label>
            <Quote>{session.provenance.sentence || 'Not provided'}</Quote>
          </div>
        </Section>

        {/* Intent */}
        <Section title="Intent" icon="🎯">
          <div className="mb-2">
            <Label>Purposes</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {session.intent.purposes.map((purpose) => (
                <Tag key={purpose}>{purpose}</Tag>
              ))}
            </div>
          </div>
          {session.intent.sentence && (
            <div>
              <Label>Statement</Label>
              <Quote>{session.intent.sentence}</Quote>
            </div>
          )}
        </Section>

        {/* Context */}
        <Section title="Context" icon="🌍">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <Label>Setting</Label>
              <Value>{settingLabels[session.context.setting] || session.context.setting}</Value>
            </div>
            <div>
              <Label>Function</Label>
              <Value>{functionLabels[session.context.function] || session.context.function}</Value>
            </div>
          </div>
          {session.context.narrative && (
            <div className="mb-3">
              <Label>Narrative</Label>
              <Quote>{session.context.narrative}</Quote>
            </div>
          )}
          {session.context.constraints.length > 0 && (
            <div className="mb-3">
              <Label>Constraints</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {session.context.constraints.map((c) => (
                  <Tag key={c} variant="muted">{c}</Tag>
                ))}
              </div>
            </div>
          )}
          {session.context.futureNote && (
            <div>
              <Label>Note to Future Viewers</Label>
              <Quote>{session.context.futureNote}</Quote>
            </div>
          )}
        </Section>

        {/* Community Authority */}
        <Section title="Community Authority" icon="🛡️">
          <div className="mb-2">
            <Label>Authorization Type</Label>
            <Value>{authLabels[session.communityAuthority.type] || session.communityAuthority.type}</Value>
          </div>
          {session.communityAuthority.restrictions.length > 0 && (
            <div>
              <Label>Restrictions</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {session.communityAuthority.restrictions.map((r, i) => (
                  <Tag key={i} variant="warning">{r}</Tag>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Apparatus */}
        <Section title="Apparatus" icon="📹">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <Label>Device</Label>
              <Value className="font-mono text-sm">{session.apparatus.device || 'Unknown'}</Value>
            </div>
            <div>
              <Label>Browser</Label>
              <Value className="font-mono text-sm">{session.apparatus.browser || 'Unknown'}</Value>
            </div>
            <div>
              <Label>Camera Position</Label>
              <Value>{session.apparatus.cameraPosition || 'Not specified'}</Value>
            </div>
            <div>
              <Label>Body Visibility</Label>
              <Value>{session.apparatus.bodyVisibility || 'Not specified'}</Value>
            </div>
          </div>
          {session.apparatus.notes && (
            <div>
              <Label>Notes</Label>
              <Quote>{session.apparatus.notes}</Quote>
            </div>
          )}
        </Section>

        {/* Interpretive Seed */}
        <Section title="Interpretive Seed" icon="🌱">
          <Quote className="text-base">
            {session.interpretiveSeed || 'No interpretive seed provided'}
          </Quote>
        </Section>
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="pb-6 border-b border-[#333] last:border-0 last:pb-0">
      <h4 className="flex items-center gap-2 text-[#f5f5f5] font-medium mb-3">
        <span>{icon}</span>
        <span>{title}</span>
      </h4>
      <div className="pl-6">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs text-[#666] uppercase tracking-wider mb-1">
      {children}
    </span>
  );
}

function Value({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`block text-[#f5f5f5] ${className}`}>
      {children}
    </span>
  );
}

function Quote({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm text-[#a0a0a0] italic leading-relaxed ${className}`}>
      &ldquo;{children}&rdquo;
    </p>
  );
}

function Tag({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'muted' | 'warning' }) {
  const variants = {
    default: 'bg-[#d4a373]/20 text-[#d4a373]',
    muted: 'bg-[#333] text-[#a0a0a0]',
    warning: 'bg-[#9d8189]/20 text-[#9d8189]',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs capitalize ${variants[variant]}`}>
      {children}
    </span>
  );
}

export default RecordnessPanel;
