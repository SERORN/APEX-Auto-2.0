import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

const SignupLogin: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const redirectTo = import.meta.env.MODE === 'development'
    ? 'http://localhost:5173/auth/callback'
    : 'https://apex-auto-2-0.vercel.app/auth/callback';

  return (
    <div className="animate-fade-in flex flex-col md:flex-row max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-lg font-semibold rounded-tl-2xl rounded-bl-2xl focus:outline-none transition ${tab === 'login' ? 'bg-gray-100 text-blue-700' : 'bg-white text-gray-500'}`}
            onClick={() => setTab('login')}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2 text-lg font-semibold rounded-tr-2xl rounded-br-2xl focus:outline-none transition ${tab === 'signup' ? 'bg-gray-100 text-blue-700' : 'bg-white text-gray-500'}`}
            onClick={() => setTab('signup')}
          >
            Crear cuenta
          </button>
        </div>
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
            <input
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder:text-gray-400 transition-shadow"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder:text-gray-400 transition-shadow"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <div className="text-red-600 text-sm animate-shake">{error}</div>}
            <button
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition text-sm sm:text-base font-semibold shadow-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-600 animate-fade-in"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
                }}
                className="w-full flex items-center justify-center gap-2 border px-4 py-3 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base font-medium text-gray-700 animate-fade-in"
                aria-label="Iniciar sesión con Google"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Iniciar sesión con Google
              </button>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signInWithOAuth({ provider: 'azure', options: { redirectTo } });
                }}
                className="w-full flex items-center justify-center gap-2 border px-4 py-3 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base font-medium text-gray-700 animate-fade-in"
                aria-label="Iniciar sesión con Microsoft"
              >
                <FaMicrosoft className="mr-2 h-5 w-5 text-blue-700" />
                Iniciar sesión con Microsoft
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4 animate-fade-in">
            <input
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder:text-gray-400 transition-shadow"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder:text-gray-400 transition-shadow"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {error && <div className="text-red-600 text-sm animate-shake">{error}</div>}
            <button
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition text-sm sm:text-base font-semibold shadow-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-600 animate-fade-in"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
                }}
                className="w-full flex items-center justify-center gap-2 border px-4 py-3 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base font-medium text-gray-700 animate-fade-in"
                aria-label="Registrarse con Google"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Registrarse con Google
              </button>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signInWithOAuth({ provider: 'azure', options: { redirectTo } });
                }}
                className="w-full flex items-center justify-center gap-2 border px-4 py-3 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base font-medium text-gray-700 animate-fade-in"
                aria-label="Registrarse con Microsoft"
              >
                <FaMicrosoft className="mr-2 h-5 w-5 text-blue-700" />
                Registrarse con Microsoft
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-100 to-blue-300 items-center justify-center text-center p-8">
        <h2 className="text-3xl font-bold text-blue-700 leading-tight">
          ¡Bienvenido a APX Auto!
        </h2>
      </div>
    </div>
  );
};

export default SignupLogin;
