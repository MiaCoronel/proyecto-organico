// app/registro/page.js
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function RegistroPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await register(nombre, email, password);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login'); 
      }, 2000);
    } else {
      setError(result.error || 'Error desconocido al registrar');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            o{' '}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              inicia sesión si ya tienes una
            </Link>
          </p>
        </div>
        
        {success ? (
          <div className="text-center text-green-600">
            <h3 className="text-xl font-semibold">¡Registro exitoso!</h3>
            <p className="mt-2">Serás redirigido al inicio de sesión...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input name="nombre" type="text" required
                       value={nombre} onChange={(e) => setNombre(e.target.value)}
                       className="relative block w-full rounded-t-md border-gray-300 p-3"
                       placeholder="Nombre completo" />
              </div>
              <div>
                <input name="email" type="email" autoComplete="email" required
                       value={email} onChange={(e) => setEmail(e.target.value)}
                       className="relative block w-full border-gray-300 p-3"
                       placeholder="Correo electrónico" />
              </div>
              <div>
                <input name="password" type="password" required
                       value={password} onChange={(e) => setPassword(e.target.value)}
                       className="relative block w-full rounded-b-md border-gray-300 p-3"
                       placeholder="Contraseña" />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-full border border-transparent bg-green-600 py-3 px-4 text-lg font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}