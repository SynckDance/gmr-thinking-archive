import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import type { FieldPortalState } from '@/lib/types';

// GET /api/sessions - List sessions for authenticated user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('sessions')
      .select('*')
      .eq('contributor_id', userId)
      .order('updated_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    return NextResponse.json({ sessions: data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/sessions - Create new session
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: Partial<FieldPortalState> = await request.json();

    // Create session in Supabase
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        contributor_id: userId,
        status: 'draft',
        // Provenance
        provenance_role: body.provenanceRole,
        provenance_sentence: body.provenanceSentence,
        // Intent
        intent_purposes: body.intentPurposes,
        intent_sentence: body.intentSentence,
        // Context
        context_narrative: body.contextNarrative,
        context_setting: body.contextSetting,
        context_function: body.contextFunction,
        context_constraints: body.contextConstraints,
        context_future_note: body.contextFutureNote,
        // Community Authority
        authority_type: body.authorityType,
        authority_restrictions: body.authorityRestrictions,
        // Apparatus
        apparatus_device: body.apparatusDevice,
        apparatus_browser: body.apparatusBrowser,
        apparatus_camera: body.apparatusCamera,
        apparatus_visibility: body.apparatusVisibility,
        apparatus_notes: body.apparatusNotes,
        // Bodies (initially empty)
        video_url: body.videoUrl,
        pose_data_url: body.poseDataUrl,
        frame_count: body.frameCount,
        // Uncertainty
        uncertainty_flags: body.uncertaintyFlags,
        uncertainty_confidence: body.uncertaintyConfidence,
        uncertainty_notes: body.uncertaintyNotes,
        // Interpretive Seed
        interpretive_seed: body.interpretiveSeed,
        // Authority version
        current_authority_version: 1,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    // Create initial authority version
    await supabase.from('authority_versions').insert({
      session_id: data.id,
      version: 1,
      changed_by: userId,
      evidence_visibility: body.evidenceVisibility || 'private',
      computed_visibility: body.computedVisibility || 'private',
      derivatives_permission: body.derivativesPermission || 'no',
      downloads_permission: body.downloadsPermission || 'none',
    });

    return NextResponse.json({ session: data }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/sessions - Update existing session
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, ...updates } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Verify ownership
    const { data: existingSession } = await supabase
      .from('sessions')
      .select('contributor_id')
      .eq('id', sessionId)
      .single();

    if (!existingSession || existingSession.contributor_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update session
    const { data, error } = await supabase
      .from('sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

    return NextResponse.json({ session: data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
