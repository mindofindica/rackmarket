'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <nav className="border-b border-rack-border bg-rack-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-rack-accent rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
              RM
            </div>
            <span className="text-lg font-bold text-rack-text">
              Rack<span className="text-rack-accent">Market</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/" className="text-rack-muted hover:text-rack-text transition-colors text-sm">
              Browse
            </Link>
            {user ? (
              <>
                <Link href="/listings/new" className="btn-primary text-sm !py-2 !px-4">
                  + Sell Module
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-rack-muted hover:text-rack-text transition-colors text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-rack-muted hover:text-rack-text transition-colors text-sm">
                  Log In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm !py-2 !px-4">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-rack-text hover:text-rack-accent transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 space-y-3 border-t border-rack-border">
            <Link 
              href="/" 
              className="block py-2 text-rack-muted hover:text-rack-text transition-colors text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            {user ? (
              <>
                <Link 
                  href="/listings/new" 
                  className="block py-2 text-rack-accent hover:text-rack-accent-hover transition-colors text-sm font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  + Sell Module
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left py-2 text-rack-muted hover:text-rack-text transition-colors text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="block py-2 text-rack-muted hover:text-rack-text transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="block py-2 text-rack-accent hover:text-rack-accent-hover transition-colors text-sm font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
