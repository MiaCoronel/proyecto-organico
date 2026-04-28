// app/registro/page.js
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegistroPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos capturados:", { nombre, email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crea tu cuenta
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input name="nombre" type="text" required value={nombre}
                   onChange={(e) => setNombre(e.target.value)}
                   className="relative block w-full rounded-t-md border-gray-300 p-3"
                   placeholder="Nombre completo" />
            <input name="email" type="email" required value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="relative block w-full border-gray-300 p-3"
                   placeholder="Correo electrónico" />
            <input name="password" type="password" required value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="relative block w-full rounded-b-md border-gray-300 p-3"
                   placeholder="Contraseña" />
          </div>
          <button type="submit" className="w-full rounded-full bg-green-600 py-3 text-white font-semibold">
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
}