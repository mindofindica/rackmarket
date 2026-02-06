'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Profile is auto-created by database trigger on auth.users insert

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="card p-8 text-center space-y-4">
          <p className="text-4xl">✉️</p>
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-rack-muted">
            We sent a confirmation link to <strong className="text-rack-text">{email}</strong>
          </p>
          <Link href="/auth/login" className="btn-secondary inline-block mt-4">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="card p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Join RackMarket</h1>
          <p className="text-rack-muted text-sm mt-1">Start buying & selling modules</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm text-rack-muted mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="synth_wizard"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-rack-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-rack-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-rack-muted">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-rack-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
