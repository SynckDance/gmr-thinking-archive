// GMR Thinking Archive - Type Definitions

// Role Options
export type RoleOption =
  | 'own'
  | 'learning'
  | 'documenting'
  | 'reconstructing'
  | 'translating'
  | 'replication'
  | 'variation';

// Intent Options
export type IntentOption =
  | 'practice'
  | 'documentation'
  | 'instruction'
  | 'preservation'
  | 'research'
  | 'creative'
  | 'sharing';

// Setting Options
export type SettingOption =
  | 'studio'
  | 'home'
  | 'street'
  | 'club'
  | 'classroom'
  | 'ceremony'
  | 'other';

// Function Options
export type FunctionOption =
  | 'practice'
  | 'performance'
  | 'ritual'
  | 'instruction'
  | 'social'
  | 'other';

// Constraint Options
export type ConstraintOption =
  | 'space'
  | 'floor'
  | 'clothing'
  | 'crowd'
  | 'fatigue'
  | 'injury'
  | 'time'
  | 'surveillance'
  | 'other';

// Authorization Options
export type AuthorizationOption =
  | 'own'
  | 'permission'
  | 'public'
  | 'sensitive'
  | 'unsure';

// Camera Position Options
export type CameraPositionOption =
  | 'front'
  | 'side'
  | 'diagonal'
  | 'moving';

// Body Visibility Options
export type VisibilityOption =
  | 'full'
  | 'sometimes'
  | 'frequently';

// Visibility Tiers
export type VisibilityTier =
  | 'private'
  | 'invited'
  | 'community'
  | 'public';

// Derivatives Permission
export type DerivativesPermission =
  | 'yes'
  | 'community'
  | 'no';

// Downloads Permission
export type DownloadsPermission =
  | 'none'
  | 'derivatives'
  | 'restricted'
  | 'public';

// Uncertainty Level
export type UncertaintyLevel =
  | 'low'
  | 'moderate'
  | 'high';

// Authority Version
export interface AuthorityVersion {
  version: number;
  timestamp: Date;
  changedBy: string;
  reason?: string;
  evidenceVisibility: VisibilityTier;
  computedVisibility: VisibilityTier;
  derivativesPermission: DerivativesPermission;
  downloadsPermission: DownloadsPermission;
  mapDisplayPermitted?: boolean;
}

// Derivative
export interface Derivative {
  id: string;
  type: 'qtc' | 'alignment' | 'cluster' | 'visualization';
  createdAt: Date;
  authorityVersionUsed: number;
  inputDescription: string;
  outputUrl: string;
  linkedSessions?: string[];
}

// Confidence by body region
export interface BodyConfidence {
  head: number;
  torso: number;
  arms: number;
  legs: number;
}

// Replication Session - The Primary Object
export interface ReplicationSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  contributorId: string;
  status: 'draft' | 'deposited' | 'review' | 'archived';

  // Provenance
  provenance: {
    role: RoleOption;
    sentence: string;
  };

  // Intent
  intent: {
    purposes: IntentOption[];
    sentence: string;
  };

  // Context
  context: {
    narrative: string;
    setting: SettingOption;
    function: FunctionOption;
    constraints: ConstraintOption[];
    futureNote: string;
  };

  // Community Authority
  communityAuthority: {
    type: AuthorizationOption;
    restrictions: string[];
  };

  // Apparatus
  apparatus: {
    device: string;
    browser: string;
    cameraPosition: CameraPositionOption;
    bodyVisibility: VisibilityOption;
    notes: string;
  };

  // Consent (Versioned)
  authorityVersions: AuthorityVersion[];
  currentAuthorityVersion: number;

  // Bodies
  evidentiaryBody: {
    videoUrl: string;
    audioUrl?: string;
  };

  computableBody: {
    poseDataUrl: string;
    frameCount: number;
  };

  // Uncertainty
  uncertainty: {
    flags: string[];
    confidence: BodyConfidence;
    notes: string;
  };

  // Interpretive Seed
  interpretiveSeed: string;

  // Derivatives
  derivatives: Derivative[];
}

// Database row type (flat structure for Supabase)
export interface SessionRow {
  id: string;
  created_at: string;
  updated_at: string;
  contributor_id: string;
  status: string;

  // Provenance
  provenance_role: string | null;
  provenance_sentence: string | null;

  // Intent
  intent_purposes: string[] | null;
  intent_sentence: string | null;

  // Context
  context_narrative: string | null;
  context_setting: string | null;
  context_function: string | null;
  context_constraints: string[] | null;
  context_future_note: string | null;

  // Community Authority
  authority_type: string | null;
  authority_restrictions: string[] | null;

  // Apparatus
  apparatus_device: string | null;
  apparatus_browser: string | null;
  apparatus_camera: string | null;
  apparatus_visibility: string | null;
  apparatus_notes: string | null;

  // Bodies
  video_url: string | null;
  pose_data_url: string | null;
  frame_count: number | null;

  // Uncertainty
  uncertainty_flags: string[] | null;
  uncertainty_confidence: BodyConfidence | null;
  uncertainty_notes: string | null;

  // Interpretive Seed
  interpretive_seed: string | null;

  // Current authority
  current_authority_version: number;
}

// Portal step data
export interface PortalStepData {
  step: number;
  title: string;
  completed: boolean;
}

// Field Portal State
export interface FieldPortalState {
  currentStep: number;
  sessionId: string | null;

  // Step 1: Provenance
  provenanceRole: RoleOption | null;
  provenanceSentence: string;

  // Step 2: Intent
  intentPurposes: IntentOption[];
  intentSentence: string;

  // Step 3: Context
  contextNarrative: string;
  contextSetting: SettingOption | null;
  contextFunction: FunctionOption | null;
  contextConstraints: ConstraintOption[];
  contextFutureNote: string;

  // Step 4: Community Authority
  authorityType: AuthorizationOption | null;
  authorityRestrictions: string[];

  // Step 5: Apparatus
  apparatusDevice: string;
  apparatusBrowser: string;
  apparatusCamera: CameraPositionOption | null;
  apparatusVisibility: VisibilityOption | null;
  apparatusNotes: string;

  // Step 6: Consent
  evidenceVisibility: VisibilityTier;
  computedVisibility: VisibilityTier;
  derivativesPermission: DerivativesPermission;
  downloadsPermission: DownloadsPermission;

  // Step 7: Capture
  videoUrl: string | null;
  poseDataUrl: string | null;
  frameCount: number;

  // Step 8: Uncertainty
  uncertaintyFlags: string[];
  uncertaintyConfidence: BodyConfidence;
  uncertaintyNotes: string;

  // Step 9: Interpretive Seed
  interpretiveSeed: string;
}

// Initial portal state
export const initialPortalState: FieldPortalState = {
  currentStep: 0,
  sessionId: null,
  provenanceRole: null,
  provenanceSentence: '',
  intentPurposes: [],
  intentSentence: '',
  contextNarrative: '',
  contextSetting: null,
  contextFunction: null,
  contextConstraints: [],
  contextFutureNote: '',
  authorityType: null,
  authorityRestrictions: [],
  apparatusDevice: '',
  apparatusBrowser: '',
  apparatusCamera: null,
  apparatusVisibility: null,
  apparatusNotes: '',
  evidenceVisibility: 'private',
  computedVisibility: 'private',
  derivativesPermission: 'no',
  downloadsPermission: 'none',
  videoUrl: null,
  poseDataUrl: null,
  frameCount: 0,
  uncertaintyFlags: [],
  uncertaintyConfidence: { head: 0, torso: 0, arms: 0, legs: 0 },
  uncertaintyNotes: '',
  interpretiveSeed: '',
};
