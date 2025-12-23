'use client';

import Link from 'next/link';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#151515] to-[#0d0d0d]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(157, 129, 137, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(157, 129, 137, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,163,115,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-threshold)] text-xl">◈</span>
          <span className="font-[family-name:var(--font-display)] text-lg tracking-wide">GMR</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#method" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Method</a>
          <a href="#about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">About</a>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <button className="btn btn-ghost text-sm">Sign In</button>
            </SignInButton>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="uppercase text-xs tracking-[0.3em] text-[var(--text-muted)] mb-4">
            Global Movement Research
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-medium mb-6">
            The Thinking<br /><em className="text-[var(--color-archive-light)]">Archive</em>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            Movement can be deposited as accountable record through
            provenance, context, authority, and uncertainty.
          </p>
        </motion.div>

        {/* Portal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-16"
        >
          <Link href="/field/portal" className="group block">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Outer ring */}
              <div
                className="absolute inset-0 border border-[var(--color-archive)] rounded-full opacity-30
                           group-hover:opacity-60 transition-all duration-500
                           group-hover:scale-110"
                style={{ animation: 'rotate 20s linear infinite' }}
              />
              {/* Middle ring */}
              <div
                className="absolute inset-4 border border-[var(--color-threshold)] rounded-full opacity-40
                           group-hover:opacity-80 transition-all duration-500
                           group-hover:scale-105"
                style={{ animation: 'rotate 15s linear infinite reverse' }}
              />
              {/* Inner ring */}
              <div
                className="absolute inset-8 border border-[var(--color-archive-light)] rounded-full opacity-50
                           group-hover:opacity-100 transition-all duration-500"
                style={{ animation: 'rotate 10s linear infinite' }}
              />
              {/* Core */}
              <div className="relative w-16 h-16 rounded-full bg-[var(--bg-card)] border border-[var(--color-threshold)]
                            flex items-center justify-center
                            group-hover:shadow-[0_0_40px_rgba(212,163,115,0.3)] transition-all duration-500">
                <span className="text-2xl text-[var(--color-threshold)]">⬡</span>
              </div>
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,163,115,0.1)_0%,transparent_70%)]
                            group-hover:bg-[radial-gradient(circle,rgba(212,163,115,0.2)_0%,transparent_70%)] transition-all duration-500" />
            </div>
          </Link>
          <p className="text-center text-sm text-[var(--text-muted)] mt-4">Enter the Archive</p>
        </motion.div>

        {/* Three Doors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full"
        >
          <Link href="/archive" className="card group text-center py-8 px-6 hover:border-[var(--color-archive)]">
            <div className="text-3xl mb-3 text-[var(--color-archive)] group-hover:scale-110 transition-transform">◇</div>
            <h3 className="font-[family-name:var(--font-display)] text-xl mb-1">Archive</h3>
            <p className="text-sm text-[var(--text-muted)]">Explore the collection</p>
          </Link>

          <Link href="/field/portal" className="card group text-center py-8 px-6 border-[var(--color-threshold)] hover:border-[var(--color-threshold-light)] hover:shadow-[0_0_30px_rgba(212,163,115,0.15)]">
            <div className="text-3xl mb-3 text-[var(--color-threshold)] group-hover:scale-110 transition-transform">◈</div>
            <h3 className="font-[family-name:var(--font-display)] text-xl mb-1">Field Portal</h3>
            <p className="text-sm text-[var(--text-muted)]">Deposit movement</p>
          </Link>

          <Link href="/lab" className="card group text-center py-8 px-6 hover:border-[var(--color-archive)]">
            <div className="text-3xl mb-3 text-[var(--color-archive)] group-hover:scale-110 transition-transform">⬡</div>
            <h3 className="font-[family-name:var(--font-display)] text-xl mb-1">Lab</h3>
            <p className="text-sm text-[var(--text-muted)]">Analyze records</p>
          </Link>
        </motion.div>
      </section>

      {/* Two Body Principle */}
      <section id="method" className="py-24">
        <div className="container container-narrow">
          <div className="divider" />
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl mb-4">Two Bodies of Record</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <div className="text-4xl mb-4 text-[var(--color-archive)]">◯</div>
              <h4 className="font-[family-name:var(--font-display)] text-xl mb-2">Evidentiary Body</h4>
              <p className="text-sm text-[var(--text-muted)]">
                What can be seen, heard, and told. The domain of witness and situated description.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[var(--color-threshold)] mb-2">⟷</div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">always tethered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4 text-[var(--color-archive)]">◎</div>
              <h4 className="font-[family-name:var(--font-display)] text-xl mb-2">Computable Body</h4>
              <p className="text-sm text-[var(--text-muted)]">
                Derived traces that make movement legible to analysis. Never sovereign, always accountable.
              </p>
            </div>
          </div>
          <div className="divider" />
        </div>
      </section>

      {/* Ethics Statement */}
      <section id="about" className="py-24">
        <div className="container container-narrow text-center">
          <p className="text-xl text-[var(--text-secondary)] mb-12 font-[family-name:var(--font-display)] italic">
            This archive does not extract movement. It receives movement
            as entrusted record, under articulated terms.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Provenance', desc: 'Who recorded this, and under what relationship?' },
              { label: 'Context', desc: 'What conditions made this movement what it was?' },
              { label: 'Authority', desc: 'Who can see this, and what can they do with it?' },
              { label: 'Uncertainty', desc: 'What are the declared limits of this record?' },
            ].map((pillar) => (
              <div key={pillar.label} className="text-left">
                <span className="text-xs uppercase tracking-wider text-[var(--color-threshold)] font-medium">
                  {pillar.label}
                </span>
                <p className="text-sm text-[var(--text-muted)] mt-1">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[rgba(255,255,255,0.08)]">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-threshold)]">◈</span>
              <span className="text-sm text-[var(--text-muted)]">Global Movement Research</span>
            </div>
            <div className="flex gap-6 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Documentation</a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              © 2025 Sinclair Emoghene · StepMate LLC
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
