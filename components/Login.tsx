import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiMicrosoft } from 'react-icons/si';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (provider: 'google' | 'azure') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) console.error('Error al iniciar sesión:', error.message);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#F7FAFC] px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-[#EDF2F7] flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-2 text-[#2B6CB0] text-center">Iniciar sesión</h1>
        <p className="text-[#4A5568] mb-8 text-center">Accede con tu cuenta</p>
        <button
          onClick={() => handleLogin('google')}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition mb-4 text-base font-medium"
        >
          <FcGoogle className="text-xl" />
          Iniciar sesión con Google
        </button>
        <button
          onClick={() => handleLogin('azure')}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition text-base font-medium"
        >
          <SiMicrosoft className="text-xl" />
          Iniciar sesión con Microsoft
        </button>
      </div>
    </div>
  );
};

export default Login;
