import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onLogin();
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input className="w-full mb-2 p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full mb-2 p-2 border rounded" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </div>
  );
};

export default LoginPage;
