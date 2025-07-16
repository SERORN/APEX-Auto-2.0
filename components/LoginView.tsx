import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'
import { AuthSocialButtons } from './AuthSocialButtons';

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/') // Redirige al home
    }

    setLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      alert('Revisa tu correo para confirmar el registro')
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <button
          type="button"
          onClick={handleSignup}
          className="w-full mt-4 text-sm text-blue-500 hover:underline"
        >
          ¿No tienes cuenta? Regístrate
        </button>
        <div className="my-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-400 text-xs">o continúa con</span>
            <span className="flex-1 h-px bg-gray-300" />
          </div>
          <AuthSocialButtons />
        </div>
      </form>
    </div>
  )
}

export default LoginPage
