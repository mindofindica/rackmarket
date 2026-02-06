'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
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
    window.location.href = '/';
  };

  return (
    <nav className="border-b border-rack-border bg-rack-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-rack-accent rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
              RM
            </div>
            <span className="text-lg font-bold text-rack-text">
              Rack<span className="text-rack-accent">Market</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </nav>
  );
}
