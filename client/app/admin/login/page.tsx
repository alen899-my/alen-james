'use client';

import { useActionState, useState } from 'react';
import { loginAction } from '@/lib/admin/actions/auth.actions';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  const [showPass, setShowPass] = useState(false);

  const inputCls =
    'w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20';

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
              style={{ background: 'var(--accent)', fontFamily: 'Calistoga, serif' }}
            >
              AJ
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Sign in to continue</p>
            </div>
          </div>

          {/* Error */}
          {state?.error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-medium">
              {state.error}
            </div>
          )}

          {/* Form */}
          <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="alenjames899@gmail.com"
                className={inputCls}
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-1 w-full py-2.5 text-white font-semibold text-sm rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              {pending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield size={15} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            🔒 Protected admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
