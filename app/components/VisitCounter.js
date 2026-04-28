'use client';
import { useState, useEffect } from 'react';

export default function VisitCounter() {
  const [visitas, setVisitas] = useState(0);
  
  useEffect(() => {
    const visitasGuardadas = localStorage.getItem('runa_visitas');
    if (visitasGuardadas) {
      const nuevaVisita = parseInt(visitasGuardadas) + 1;
      setVisitas(nuevaVisita);
      localStorage.setItem('runa_visitas', nuevaVisita);
    } else {
      setVisitas(1);
      localStorage.setItem('runa_visitas', '1');
    }
  }, []);
  
  return (
    <div className="text-center text-sm text-gray-500 py-4">
      🌱 Visitas: {visitas} personas han explorado Allin Runa
    </div>
  );
}