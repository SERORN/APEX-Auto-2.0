import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiMicrosoft } from 'react-icons/si';
import { supabase } from '../lib/supabaseClient';

// Simple i18n hook (replace with your real i18n solution if available)
const useT = () => {
  // Example: could be replaced with context or i18n library
  const t = (key: string) => {
    const dict: Record<string, string> = {
      'login.title': 'Iniciar sesión',
      'login.email': 'Email',
      'login.password': 'Contraseña',
      'login.button': 'Entrar',
      'login.loading': 'Entrando...',
      'login.noAccount': '¿No tienes cuenta?',
      'login.signup': 'Regístrate',
      'login.forgot': '¿Olvidaste tu contraseña?',
      'login.demo': '¿Solo quieres probar? Usa una cuenta de prueba o solicita acceso.',
      'login.emailRequired': 'Por favor ingresa un email válido.',
      'login.passwordRequired': 'La contraseña debe tener al menos 6 caracteres.',
    };
    return dict[key] || key;
  };
  return t;
};

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) {
      setError(t('login.emailRequired'));
      return;
    }
    if (password.length < 6) {
      setError(t('login.passwordRequired'));
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onLogin();
    setLoading(false);
  };

  return (
    <div className="animate-fade-in mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12 mt-10 bg-[#F7FAFC] rounded-2xl shadow-lg border border-[#EDF2F7] flex flex-col items-center">
      {/* Logo/Icon */}
      <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-[#EDF2F7]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#2B6CB0" />
          <path d="M8 13l2.5 2.5L16 10" stroke="#F7FAFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-extrabold mb-4 text-[#2B6CB0] tracking-tight text-center">{t('login.title')}</h2>
      <form onSubmit={handleLogin} className="space-y-4 w-full">
        <label className="block">
          <span className="sr-only">{t('login.email')}</span>
          <input
            className="w-full p-3 border border-[#EDF2F7] rounded-lg bg-white text-[#2D3748] focus:ring-2 focus:ring-[#2B6CB0] focus:outline-none placeholder:text-[#A0AEC0] transition-shadow"
            type="email"
            placeholder={t('login.email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label={t('login.email')}
          />
        </label>
        <label className="block">
          <span className="sr-only">{t('login.password')}</span>
          <input
            className="w-full p-3 border border-[#EDF2F7] rounded-lg bg-white text-[#2D3748] focus:ring-2 focus:ring-[#2B6CB0] focus:outline-none placeholder:text-[#A0AEC0] transition-shadow"
            type="password"
            placeholder={t('login.password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            aria-label={t('login.password')}
          />
        </label>
        {error && (
          <div className="text-[#E53E3E] bg-[#FFF5F5] border border-[#FED7D7] rounded p-2 text-sm mb-2 animate-shake" role="alert">
            {error}
          </div>
        )}
        <button
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition text-sm sm:text-base font-semibold shadow-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#2B6CB0]"
          type="submit"
          disabled={loading}
          aria-busy={loading}
          tabIndex={0}
        >
          {loading ? t('login.loading') : t('login.button')}
        </button>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-[#EDF2F7]" />
          <span className="mx-3 text-[#A0AEC0] text-xs">o</span>
          <div className="flex-grow h-px bg-[#EDF2F7]" />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <button
            type="button"
            onClick={async () => {
              const redirectTo = import.meta.env.MODE === 'development'
                ? 'http://localhost:5173/auth/callback'
                : 'https://apex-auto-2-0.vercel.app/auth/callback';
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo },
              });
            }}
            className="w-full flex items-center justify-center gap-2 border px-4 py-3 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base font-medium text-gray-700"
            aria-label="Iniciar sesión con Google"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Iniciar sesión con Google
          </button>
          <button
            type="button"
            onClick={async () => {
              const redirectTo = import.meta.env.MODE === 'development'
                ? 'http://localhost:5173/auth/callback'
                : 'https://apex-auto-2-0.vercel.app/auth/callback';
              await supabase.auth.signInWithOAuth({
                provider: 'azure',
                options: { redirectTo },
              });
            }}
            className="w-full flex items-center justify-center gap-2 border px-4 py-3 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base font-medium text-gray-700 mt-2"
            aria-label="Iniciar sesión con Microsoft"
          >
            <SiMicrosoft className="mr-2 h-5 w-5 text-blue-700" />
            Iniciar sesión con Microsoft
          </button>
        </div>
        <div className="text-center mb-2">
          <a
            href="/forgot-password"
            className="text-[#2B6CB0] hover:underline text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] rounded px-1"
            tabIndex={0}
          >
            {t('login.forgot')}
          </a>
        </div>
        <div className="text-center">
          <span className="text-[#A0AEC0] text-sm">{t('login.noAccount')}</span>{' '}
          <a
            href="/signup"
            className="text-[#2B6CB0] hover:underline text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] rounded px-1"
            tabIndex={0}
          >
            {t('login.signup')}
          </a>
        </div>
        <div className="text-center mt-3">
          <span className="text-[#A0AEC0] text-xs">{t('login.demo')}</span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
