import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const SignupPage: React.FC<{ onSignup: () => void }> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cliente');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crear cuenta</h2>
      <form onSubmit={handleSignup}>
        <input className="w-full mb-2 p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full mb-2 p-2 border rounded" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <select className="w-full mb-2 p-2 border rounded" value={role} onChange={e => setRole(e.target.value)}>
          <option value="cliente">Cliente</option>
          <option value="proveedor">Proveedor</option>
        </select>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button className="w-full bg-green-600 text-white py-2 rounded" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</button>
      </form>
    </div>
  );
};

export default SignupPage;
