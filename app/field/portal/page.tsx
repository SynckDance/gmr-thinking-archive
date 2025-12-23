'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FieldPortalState,
  initialPortalState,
  RoleOption,
  IntentOption,
  SettingOption,
  FunctionOption,
  ConstraintOption,
  AuthorizationOption,
  CameraPositionOption,
  VisibilityOption,
  VisibilityTier,
  DerivativesPermission,
  DownloadsPermission,
} from '@/lib/types';

const STEPS = [
  { num: 0, title: 'Portal Oath', subtitle: 'Framing statement' },
  { num: 1, title: 'Provenance', subtitle: 'Role and relationship' },
  { num: 2, title: 'Intent', subtitle: 'Purposes of capture' },
  { num: 3, title: 'Context', subtitle: 'Conditions and setting' },
  { num: 4, title: 'Community Authority', subtitle: 'Authorization type' },
  { num: 5, title: 'Apparatus', subtitle: 'Device and camera' },
  { num: 6, title: 'Consent', subtitle: 'Visibility tiers' },
  { num: 7, title: 'Capture', subtitle: 'Record movement' },
  { num: 8, title: 'Uncertainty', subtitle: 'Declared limits' },
  { num: 9, title: 'Interpretive Seed', subtitle: 'Meaning claim' },
  { num: 10, title: 'Deposit', subtitle: 'Confirm record' },
];

const ROLE_OPTIONS: { value: RoleOption; label: string; description: string }[] = [
  { value: 'own', label: 'Recording my own movement', description: 'This is movement I perform and claim' },
  { value: 'learning', label: 'Learning movement', description: 'I am learning from another source' },
  { value: 'documenting', label: 'Documenting', description: 'Witnessing and recording others' },
  { value: 'reconstructing', label: 'Reconstructing', description: 'Rebuilding from memory or record' },
  { value: 'translating', label: 'Translating', description: 'Adapting to new context' },
  { value: 'replication', label: 'Replication', description: 'Attempting to reproduce' },
  { value: 'variation', label: 'Variation', description: 'Intentional departure' },
];

const INTENT_OPTIONS: { value: IntentOption; label: string }[] = [
  { value: 'practice', label: 'Practice / Training' },
  { value: 'documentation', label: 'Documentation / Witnessing' },
  { value: 'instruction', label: 'Instruction / Teaching' },
  { value: 'preservation', label: 'Preservation / Archive' },
  { value: 'research', label: 'Research / Analysis' },
  { value: 'creative', label: 'Creative / Artistic' },
  { value: 'sharing', label: 'Sharing / Community' },
];

const SETTING_OPTIONS: { value: SettingOption; label: string }[] = [
  { value: 'studio', label: 'Studio' },
  { value: 'home', label: 'Home' },
  { value: 'street', label: 'Street / Outdoor' },
  { value: 'club', label: 'Club / Venue' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'ceremony', label: 'Ceremony / Ritual' },
  { value: 'other', label: 'Other' },
];

const FUNCTION_OPTIONS: { value: FunctionOption; label: string }[] = [
  { value: 'practice', label: 'Practice' },
  { value: 'performance', label: 'Performance' },
  { value: 'ritual', label: 'Ritual / Ceremony' },
  { value: 'instruction', label: 'Instruction' },
  { value: 'social', label: 'Social Exchange' },
  { value: 'other', label: 'Other' },
];

const CONSTRAINT_OPTIONS: { value: ConstraintOption; label: string }[] = [
  { value: 'space', label: 'Limited space' },
  { value: 'floor', label: 'Floor surface' },
  { value: 'clothing', label: 'Clothing restrictions' },
  { value: 'crowd', label: 'Crowd proximity' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'injury', label: 'Injury / Pain' },
  { value: 'time', label: 'Time pressure' },
  { value: 'surveillance', label: 'Surveillance risk' },
  { value: 'other', label: 'Other' },
];

const AUTHORITY_OPTIONS: { value: AuthorizationOption; label: string; description: string }[] = [
  { value: 'own', label: 'Own authored material', description: 'This is my own movement' },
  { value: 'permission', label: 'With permission', description: 'I have authorization from the source' },
  { value: 'public', label: 'Public domain', description: 'This movement is publicly shared' },
  { value: 'sensitive', label: 'Culturally sensitive', description: 'Requires community review' },
  { value: 'unsure', label: 'Unsure', description: 'I need guidance on authority' },
];

export default function FieldPortalPage() {
  const { user } = useUser();
  const [state, setState] = useState<FieldPortalState>(initialPortalState);

  const updateState = (updates: Partial<FieldPortalState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (state.currentStep < STEPS.length - 1) {
      updateState({ currentStep: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 0) {
      updateState({ currentStep: state.currentStep - 1 });
    }
  };

  const renderStepContent = () => {
    switch (state.currentStep) {
      case 0:
        return <PortalOathStep />;
      case 1:
        return <ProvenanceStep state={state} updateState={updateState} />;
      case 2:
        return <IntentStep state={state} updateState={updateState} />;
      case 3:
        return <ContextStep state={state} updateState={updateState} />;
      case 4:
        return <AuthorityStep state={state} updateState={updateState} />;
      case 5:
        return <ApparatusStep state={state} updateState={updateState} />;
      case 6:
        return <ConsentStep state={state} updateState={updateState} />;
      case 7:
        return <CaptureStep state={state} updateState={updateState} />;
      case 8:
        return <UncertaintyStep state={state} updateState={updateState} />;
      case 9:
        return <SeedStep state={state} updateState={updateState} />;
      case 10:
        return <DepositStep state={state} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#151515] to-[#0d0d0d]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 163, 115, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 163, 115, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[rgba(13,13,13,0.8)] backdrop-blur-sm border-b border-[rgba(255,255,255,0.05)]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[var(--color-threshold)] text-xl">◈</span>
          <span className="font-[family-name:var(--font-display)] text-lg tracking-wide">GMR</span>
        </Link>
        <div className="text-sm text-[var(--text-muted)]">
          Field Portal
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto min-h-screen flex flex-col">
        {/* Progress Steps */}
        <div className="progress-steps my-8">
          {STEPS.map((step, index) => (
            <div
              key={step.num}
              className={`progress-step ${
                index < state.currentStep
                  ? 'completed'
                  : index === state.currentStep
                  ? 'current'
                  : ''
              }`}
            />
          ))}
        </div>

        {/* Step Title */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Step {state.currentStep} of {STEPS.length - 1}
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl mb-1">
            {STEPS[state.currentStep]?.title}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {STEPS[state.currentStep]?.subtitle}
          </p>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-[rgba(255,255,255,0.08)] mt-8">
          <button
            onClick={prevStep}
            disabled={state.currentStep === 0}
            className="btn btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <p className="text-xs text-[var(--text-muted)] text-center max-w-xs">
            You can pause and resume without losing progress.
          </p>
          <button
            onClick={nextStep}
            disabled={state.currentStep === STEPS.length - 1}
            className="btn btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </div>
    </main>
  );
}

// Step Components

function PortalOathStep() {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl text-[var(--color-threshold)] mb-6">◈</div>
      <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
        You are about to deposit movement as accountable record.
      </p>
      <p className="text-[var(--text-secondary)]">
        The archive receives movement under articulated terms—not as raw capture,
        but as entrusted record with provenance, context, authority, and uncertainty.
      </p>
      <div className="divider" />
      <p className="text-sm text-[var(--text-muted)]">
        Each step gathers information that becomes part of the record.
        This is not a form—it is an admission ceremony.
      </p>
    </div>
  );
}

function ProvenanceStep({ state, updateState }: { state: FieldPortalState; updateState: (u: Partial<FieldPortalState>) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        What is your relationship to this movement?
      </p>
      <div className="space-y-3">
        {ROLE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`form-option ${state.provenanceRole === option.value ? 'selected' : ''}`}
            onClick={() => updateState({ provenanceRole: option.value })}
          >
            <div className="form-option-indicator" />
            <div className="form-option-content">
              <div className="form-option-title">{option.label}</div>
              <div className="form-option-description">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
      <div className="form-group mt-8">
        <label className="form-label">
          Describe your relationship in your own words
        </label>
        <textarea
          className="form-textarea"
          placeholder="e.g., 'This is my personal practice of a dance I learned from...'"
          value={state.provenanceSentence}
          onChange={(e) => updateState({ provenanceSentence: e.target.value })}
        />
      </div>
    </div>
  );
}

function IntentStep({ state, updateState }: { state: FieldPortalState; updateState: (u: Partial<FieldPortalState>) => void }) {
  const toggleIntent = (intent: IntentOption) => {
    const current = state.intentPurposes;
    if (current.includes(intent)) {
      updateState({ intentPurposes: current.filter((i) => i !== intent) });
    } else {
      updateState({ intentPurposes: [...current, intent] });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        Why are you recording this movement? Select all that apply.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {INTENT_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`form-option form-option-checkbox ${
              state.intentPurposes.includes(option.value) ? 'selected' : ''
            }`}
            onClick={() => toggleIntent(option.value)}
          >
            <div className="form-option-indicator" />
            <div className="form-option-content">
              <div className="form-option-title">{option.label}</div>
            </div>
          </label>
        ))}
      </div>
      <div className="form-group mt-8">
        <label className="form-label">
          Describe your intent
        </label>
        <textarea
          className="form-textarea"
          placeholder="e.g., 'Documenting my current embodiment for comparison with earlier recordings...'"
          value={state.intentSentence}
          onChange={(e) => updateState({ intentSentence: e.target.value })}
        />
      </div>
    </div>
  );
}

function ContextStep({ state, updateState }: { state: FieldPortalState; updateState: (u: Partial<FieldPortalState>) => void }) {
  const toggleConstraint = (constraint: ConstraintOption) => {
    const current = state.contextConstraints;
    if (current.includes(constraint)) {
      updateState({ contextConstraints: current.filter((c) => c !== constraint) });
    } else {
      updateState({ contextConstraints: [...current, constraint] });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        Where is this movement happening, and what conditions shape it?
      </p>

      <div className="form-group">
        <label className="form-label">Narrative</label>
        <textarea
          className="form-textarea"
          placeholder="Describe the context in 30-90 seconds of speech..."
          value={state.contextNarrative}
          onChange={(e) => updateState({ contextNarrative: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Setting</label>
        <div className="flex flex-wrap gap-2">
          {SETTING_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateState({ contextSetting: option.value })}
              className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                state.contextSetting === option.value
                  ? 'border-[var(--color-threshold)] bg-[var(--color-active)] text-[var(--text-primary)]'
                  : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Function</label>
        <div className="flex flex-wrap gap-2">
          {FUNCTION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateState({ contextFunction: option.value })}
              className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                state.contextFunction === option.value
                  ? 'border-[var(--color-threshold)] bg-[var(--color-active)] text-[var(--text-primary)]'
                  : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Constraints present today</label>
        <div className="flex flex-wrap gap-2">
          {CONSTRAINT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleConstraint(option.value)}
              className={`px-3 py-1.5 rounded-md border transition-all text-xs ${
                state.contextConstraints.includes(option.value)
                  ? 'border-[var(--color-threshold)] bg-[var(--color-active)] text-[var(--text-primary)]'
                  : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Note for future readers
        </label>
        <textarea
          className="form-textarea"
          placeholder="What do they need to know to avoid misreading this record?"
          value={state.contextFutureNote}
          onChange={(e) => updateState({ contextFutureNote: e.target.value })}
        />
      </div>
    </div>
  );
}

function AuthorityStep({ state, updateState }: { state: FieldPortalState; updateState: (u: Partial<FieldPortalState>) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        What is your authorization to record and share this movement?
      </p>
      <div className="space-y-3">
        {AUTHORITY_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`form-option ${state.authorityType === option.value ? 'selected' : ''}`}
            onClick={() => updateState({ authorityType: option.value })}
          >
            <div className="form-option-indicator" />
            <div className="form-option-content">
              <div className="form-option-title">{option.label}</div>
              <div className="form-option-description">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function ApparatusStep({ state, updateState }: { state: FieldPortalState; updateState: (u: Partial<FieldPortalState>) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        What device and setup are you using to capture?
      </p>

      <div className="card">
        <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Detected Device</p>
        <p className="text-[var(--text-primary)]">
          {typeof navigator !== 'undefined' ? navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown Device' : 'Unknown Device'}
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Camera Position</label>
        <div className="flex flex-wrap gap-2">
          {(['front', 'side', 'diagonal', 'moving'] as CameraPositionOption[]).map((pos) => (
            <button
              key={pos}
              onClick={() => updateState({ apparatusCamera: pos })}
              className={`px-4 py-2 rounded-lg border transition-all text-sm capitalize ${
                state.apparatusCamera === pos
                  ? 'border-[var(--color-threshold)] bg-[var(--color-active)] text-[var(--text-primary)]'
                  : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Body Visibility</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'full' as VisibilityOption, label: 'Full body visible' },
            { value: 'sometimes' as VisibilityOption, label: 'Sometimes cropped' },
            { value: 'frequently' as VisibilityOption, label: 'Frequently cropped' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateState({ apparatusVisibility: opt.value })}
              className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                state.apparatusVisibility === opt.value
                  ? 'border-[var(--color-threshold)] bg-[var(--color-active)] text-[var(--text-primary)]'
                  : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Additional notes about setup</label>
        <textarea
          className="form-textarea"
          placeholder="Any relevant details about lighting, angle, or capture conditions..."
          value={state.apparatusNotes}
          onChange={(e) => updateState({ apparatusNotes: e.target.value })}
        />
      </div>
    </div>
  );
}

function ConsentStep({ state, updateState }: { state: FieldPortalState; updateState: (u: Partial<FieldPortalState>) => void }) {
  const visibilityOptions: { value: VisibilityTier; label: string }[] = [
    { value: 'private', label: 'Only me' },
    { value: 'invited', label: 'Invited' },
    { value: 'community', label: 'Community' },
    { value: 'public', label: 'Public' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        Who can see and use this record?
      </p>

      <div className="form-group">
        <label className="form-label">Evidence Visibility (Video)</label>
        <div className="flex flex-wrap gap-2">
          {visibilityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateState({ evidenceVisibility: opt.value })}
              className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                state.evidenceVisibility === opt.value
                  ? 'border-[var(--color-threshold)] bg-[var(--color-active)] text-[var(--text-primary)]'
                  : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Computed Visibility (Pose Data)</label>
        <div className="flex flex-wrap gap-2">
          {visibilityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateState({ computedVisibility: opt.value })}
              className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                state.computedVisibility === opt.value
                  ? 'border-[var(--color-threshold)] bg-[var(--color-active)] text-[var(--text-primary)]'
                  : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Derivatives Permission</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'yes' as DerivativesPermission, label: 'Yes, allow derivatives' },
            { value: 'community' as DerivativesPermission, label: 'Community only' },
            { value: 'no' as DerivativesPermission, label: 'No derivatives' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateState({ derivativesPermission: opt.value })}
              className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                state.derivativesPermission === opt.value
                  ? 'border-[var(--color-threshold)] bg-[var(--color-active)] text-[var(--text-primary)]'
                  : 'border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CaptureStep({ state, updateState }: { state: FieldPortalState; updateState: (u: Partial<FieldPortalState>) => void }) {
  return (
    <div className="space-y-6 text-center">
      <p className="text-[var(--text-secondary)]">
        Record your movement. The capture will include live pose tracking.
      </p>

      <div className="aspect-video bg-[var(--bg-card)] rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 text-[var(--text-muted)]">◎</div>
          <p className="text-sm text-[var(--text-muted)]">Camera view will appear here</p>
          <button className="btn btn-secondary mt-4">
            Enable Camera
          </button>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        Video and pose data will be captured simultaneously.
        Both bodies of record will be generated from this capture.
      </p>
    </div>
  );
}

function UncertaintyStep({ state, updateState }: { state: FieldPortalState; updateState: (u: Partial<FieldPortalState>) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        What are the declared limits of this record?
      </p>

      <div className="card">
        <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-4">Auto-Detected Conditions</p>
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-community">Low lighting detected</span>
          <span className="badge badge-community">Partial occlusion</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-4">
          These are observations, not judgments. Uncertainty is a boundary the archive remembers.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Additional notes on uncertainty</label>
        <textarea
          className="form-textarea"
          placeholder="What else should the archive know about the limits of this record?"
          value={state.uncertaintyNotes}
          onChange={(e) => updateState({ uncertaintyNotes: e.target.value })}
        />
      </div>
    </div>
  );
}

function SeedStep({ state, updateState }: { state: FieldPortalState; updateState: (u: Partial<FieldPortalState>) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-[var(--text-secondary)]">
        What does this movement mean to you? This is your interpretive seed—a claim
        that travels with the record.
      </p>

      <div className="form-group">
        <label className="form-label">Your meaning claim</label>
        <textarea
          className="form-textarea min-h-[200px]"
          placeholder="e.g., 'This is a simplified version of the opening sequence for Shangó. It should not be compared to ceremonial recordings without noting the practice context...'"
          value={state.interpretiveSeed}
          onChange={(e) => updateState({ interpretiveSeed: e.target.value })}
        />
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        This is not metadata—it is part of the record itself.
      </p>
    </div>
  );
}

function DepositStep({ state }: { state: FieldPortalState }) {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl text-[var(--color-threshold)] mb-6">◈</div>
      <h3 className="font-[family-name:var(--font-display)] text-2xl">
        Ready to Deposit
      </h3>
      <p className="text-[var(--text-secondary)]">
        Your movement will be deposited as an accountable record with:
      </p>

      <div className="text-left space-y-2 max-w-md mx-auto">
        <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
          <span className="text-[var(--text-muted)]">Provenance</span>
          <span className="text-[var(--text-primary)]">{state.provenanceRole || '—'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
          <span className="text-[var(--text-muted)]">Intent</span>
          <span className="text-[var(--text-primary)]">{state.intentPurposes.length} purposes</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
          <span className="text-[var(--text-muted)]">Setting</span>
          <span className="text-[var(--text-primary)]">{state.contextSetting || '—'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
          <span className="text-[var(--text-muted)]">Authority</span>
          <span className="text-[var(--text-primary)]">{state.authorityType || '—'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
          <span className="text-[var(--text-muted)]">Evidence Visibility</span>
          <span className="badge badge-private">{state.evidenceVisibility}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[var(--text-muted)]">Computed Visibility</span>
          <span className="badge badge-private">{state.computedVisibility}</span>
        </div>
      </div>

      <button className="btn btn-primary text-lg px-12 py-4">
        Deposit Record
      </button>

      <p className="text-xs text-[var(--text-muted)]">
        You can change authority settings after deposit.
        The original terms are preserved in version history.
      </p>
    </div>
  );
}
