import { supabase } from '../lib/supabaseClient';
import { SiMicrosoft } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';

const getRedirectTo = () =>
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5173/auth/callback'
    : 'https://apex-auto-2-0.vercel.app/auth/callback';

export const AuthSocialButtons = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getRedirectTo() },
    });
    setLoading(false);
  };

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: { redirectTo: getRedirectTo() },
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-6">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 transition w-full"
        disabled={loading}
        aria-label="Continuar con Google"
      >
        <FcGoogle className="text-xl" />
        Continuar con Google
      </button>
      <button
        onClick={handleMicrosoftLogin}
        className="flex items-center justify-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 transition w-full"
        disabled={loading}
        aria-label="Continuar con Microsoft"
      >
        <SiMicrosoft className="text-xl text-blue-700" />
        Continuar con Microsoft
      </button>
      {loading && (
        <div className="text-center text-gray-500 text-sm mt-2">Redirigiendo...</div>
      )}
    </div>
  );
};
