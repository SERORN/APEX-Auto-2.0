import { supabase } from '../lib/supabaseClient';

const AuthMicrosoftButton = () => {
  const handleMicrosoftLogin = async () => {
    const redirectTo = import.meta.env.MODE === 'development'
      ? 'http://localhost:5173/auth/callback'
      : 'https://apex-auto-2-0.vercel.app/auth/callback';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo,
      },
    });

    if (error) console.error('Error al iniciar sesión con Microsoft:', error);
  };

  return (
    <button
      onClick={handleMicrosoftLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Iniciar sesión con Microsoft
    </button>
  );
};

export default AuthMicrosoftButton;
