-- GMR Thinking Archive - Supabase Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table (Primary Object)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  contributor_id TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'deposited', 'review', 'archived')),

  -- Provenance
  provenance_role TEXT,
  provenance_sentence TEXT,

  -- Intent
  intent_purposes TEXT[],
  intent_sentence TEXT,

  -- Context
  context_narrative TEXT,
  context_setting TEXT,
  context_function TEXT,
  context_constraints TEXT[],
  context_future_note TEXT,

  -- Community Authority
  authority_type TEXT,
  authority_restrictions TEXT[],

  -- Apparatus
  apparatus_device TEXT,
  apparatus_browser TEXT,
  apparatus_camera TEXT,
  apparatus_visibility TEXT,
  apparatus_notes TEXT,

  -- Bodies
  video_url TEXT,
  pose_data_url TEXT,
  frame_count INTEGER DEFAULT 0,

  -- Uncertainty
  uncertainty_flags TEXT[],
  uncertainty_confidence JSONB,
  uncertainty_notes TEXT,

  -- Interpretive Seed
  interpretive_seed TEXT,

  -- Current authority version
  current_authority_version INTEGER DEFAULT 1
);

-- Authority versions table
CREATE TABLE IF NOT EXISTS authority_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by TEXT NOT NULL,
  reason TEXT,
  evidence_visibility TEXT DEFAULT 'private' CHECK (evidence_visibility IN ('private', 'invited', 'community', 'public')),
  computed_visibility TEXT DEFAULT 'private' CHECK (computed_visibility IN ('private', 'invited', 'community', 'public')),
  derivatives_permission TEXT DEFAULT 'no' CHECK (derivatives_permission IN ('yes', 'community', 'no')),
  downloads_permission TEXT DEFAULT 'none' CHECK (downloads_permission IN ('none', 'derivatives', 'restricted', 'public')),

  UNIQUE(session_id, version)
);

-- Derivatives table
CREATE TABLE IF NOT EXISTS derivatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('qtc', 'alignment', 'cluster', 'visualization')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  authority_version INTEGER NOT NULL,
  output_url TEXT,
  input_description TEXT,
  linked_sessions UUID[],
  metadata JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_contributor ON sessions(contributor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_updated ON sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_authority_session ON authority_versions(session_id);
CREATE INDEX IF NOT EXISTS idx_derivatives_session ON derivatives(session_id);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE authority_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivatives ENABLE ROW LEVEL SECURITY;

-- Policies for sessions
CREATE POLICY "Users can view public sessions" ON sessions
  FOR SELECT
  USING (
    current_authority_version IN (
      SELECT version FROM authority_versions
      WHERE session_id = sessions.id
      AND evidence_visibility = 'public'
    )
    OR contributor_id = auth.uid()::text
  );

CREATE POLICY "Users can insert own sessions" ON sessions
  FOR INSERT
  WITH CHECK (contributor_id = auth.uid()::text);

CREATE POLICY "Users can update own sessions" ON sessions
  FOR UPDATE
  USING (contributor_id = auth.uid()::text);

CREATE POLICY "Users can delete own sessions" ON sessions
  FOR DELETE
  USING (contributor_id = auth.uid()::text);

-- Policies for authority_versions
CREATE POLICY "Users can view authority versions" ON authority_versions
  FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM sessions WHERE contributor_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert authority versions" ON authority_versions
  FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM sessions WHERE contributor_id = auth.uid()::text
    )
  );

-- Policies for derivatives
CREATE POLICY "Users can view derivatives" ON derivatives
  FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM sessions WHERE contributor_id = auth.uid()::text
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (for public/anon access via API)
GRANT SELECT ON sessions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON sessions TO authenticated;
GRANT SELECT ON authority_versions TO anon, authenticated;
GRANT INSERT ON authority_versions TO authenticated;
GRANT SELECT ON derivatives TO anon, authenticated;
