import { supabase } from '../lib/supabaseClient';

const AuthGoogleButton = () => {
  const handleGoogleLogin = async () => {
    // 🔧 FIX: Cambiar el valor de `redirectTo` a la URL base del sitio sin `/auth/callback` para evitar error 404 en Vercel.
    const redirectTo = import.meta.env.MODE === 'development'
      ? 'http://localhost:5173/'
      : 'https://apex-auto-2-0.vercel.app/';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) console.error('Error al iniciar sesión con Google:', error);
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Iniciar sesión con Google
    </button>
  );
};

export default AuthGoogleButton;
