import React, { useState } from 'react';
import AuthGoogleButton from './AuthGoogleButton';
import AuthMicrosoftButton from './AuthMicrosoftButton';
import { supabase } from '../lib/supabaseClient';

// Simple i18n hook (replace with your real i18n solution if available)
const useT = () => {
  const t = (key: string) => {
    const dict: Record<string, string> = {
      'signup.title': 'Crear cuenta',
      'signup.email': 'Email',
      'signup.password': 'Contraseña',
      'signup.role': 'Tipo de usuario',
      'signup.cliente': 'Cliente',
      'signup.proveedor': 'Proveedor',
      'signup.button': 'Crear cuenta',
      'signup.loading': 'Creando...',
      'signup.login': '¿Ya tienes cuenta?',
      'signup.loginLink': 'Inicia sesión',
      'signup.emailRequired': 'Por favor ingresa un email válido.',
      'signup.passwordRequired': 'La contraseña debe tener al menos 6 caracteres.',
      'signup.roleRequired': 'Selecciona un tipo de usuario.',
    };
    return dict[key] || key;
  };
  return t;
};

const SignupPage: React.FC<{ onSignup: () => void }> = ({ onSignup }) => {
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cliente');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) {
      setError(t('signup.emailRequired'));
      return;
    }
    if (password.length < 6) {
      setError(t('signup.passwordRequired'));
      return;
    }
    if (!role) {
      setError(t('signup.roleRequired'));
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    });
    if (error) setError(error.message);
    else onSignup();
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-8 bg-[#F7FAFC] rounded-2xl shadow-lg border border-[#EDF2F7] flex flex-col items-center">
      <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-[#EDF2F7]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#2B6CB0" />
          <path d="M8 13l2.5 2.5L16 10" stroke="#F7FAFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-extrabold mb-4 text-[#2B6CB0] tracking-tight text-center">{t('signup.title')}</h2>
      <form onSubmit={handleSignup} className="space-y-4 w-full">
        <label className="block">
          <span className="sr-only">{t('signup.email')}</span>
          <input
            className="w-full p-3 border border-[#EDF2F7] rounded-lg bg-white text-[#2D3748] focus:ring-2 focus:ring-[#2B6CB0] focus:outline-none placeholder:text-[#A0AEC0] transition-shadow"
            type="email"
            placeholder={t('signup.email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label={t('signup.email')}
          />
        </label>
        <label className="block">
          <span className="sr-only">{t('signup.password')}</span>
          <input
            className="w-full p-3 border border-[#EDF2F7] rounded-lg bg-white text-[#2D3748] focus:ring-2 focus:ring-[#2B6CB0] focus:outline-none placeholder:text-[#A0AEC0] transition-shadow"
            type="password"
            placeholder={t('signup.password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label={t('signup.password')}
          />
        </label>
        <label className="block">
          <span className="sr-only">{t('signup.role')}</span>
          <select
            className="w-full p-3 border border-[#EDF2F7] rounded-lg bg-white text-[#2D3748] focus:ring-2 focus:ring-[#2B6CB0] focus:outline-none"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
            aria-label={t('signup.role')}
          >
            <option value="cliente">{t('signup.cliente')}</option>
            <option value="proveedor">{t('signup.proveedor')}</option>
          </select>
        </label>
        {error && (
          <div className="text-[#E53E3E] bg-[#FFF5F5] border border-[#FED7D7] rounded p-2 text-sm mb-2 animate-shake" role="alert">
            {error}
          </div>
        )}
        <button
          className="w-full bg-[#2B6CB0] hover:bg-[#3182CE] text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-lg shadow-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#2B6CB0]"
          type="submit"
          disabled={loading}
          aria-busy={loading}
          tabIndex={0}
        >
          {loading ? t('signup.loading') : t('signup.button')}
        </button>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-[#EDF2F7]" />
          <span className="mx-3 text-[#A0AEC0] text-xs">o</span>
          <div className="flex-grow h-px bg-[#EDF2F7]" />
        </div>
        <div className="flex flex-col gap-3 mb-4">
          <AuthGoogleButton />
          <AuthMicrosoftButton />
        </div>
        <div className="text-center">
          <span className="text-[#A0AEC0] text-sm">{t('signup.login')}</span>{' '}
          <a
            href="/login"
            className="text-[#2B6CB0] hover:underline text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] rounded px-1"
            tabIndex={0}
          >
            {t('signup.loginLink')}
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
