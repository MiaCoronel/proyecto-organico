// app/blog/page.js
"use client"; // <-- ¡NUEVO! Necesario para las animaciones

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'; // <-- ¡NUEVO! Importar motion

// Importamos los componentes y datos
import { getBlogPosts } from '../../lib/blogData';
import BlogCard from '../components/BlogCard';

// --- ¡NUEVO! Definición de las animaciones ---
const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' }}
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' }}
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Retraso de 0.2s entre cada tarjeta
      ease: 'easeOut'
    }
  }
};
// ---------------------------------------------

export default function BlogPage() {
  const posts = getBlogPosts(); // Obtenemos los 4 posts

  return (
    <main className="flex flex-col items-center">
      
      {/* --- SECCIÓN 1: HERO DEL BLOG (Animado) --- */}
      <section className="relative w-full h-[70vh] flex items-center justify-center text-center text-white -mt-16">
        <Image
          src="/img/blog/blog-hero.webp" 
          alt="Ingredientes saludables en una mesa"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
          priority // ¡NUEVO! Prioriza la carga de esta imagen
        />
        {/* NUEVO: Contenedor de animación (sin 'stagger' aquí, solo animaciones individuales) */}
        <div className="relative z-10 max-w-3xl p-4">
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold mb-4"
            variants={fadeInDown} // Título baja
            initial="hidden"
            animate="visible"
          >
            Nuestro Blog Orgánico
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl"
            variants={fadeInUp} // Subtítulo sube
            initial="hidden"
            animate="visible"
          >
            Recetas, guías de salud y las historias de nuestros productores.
          </motion.p>
        </div>
      </section>

      {/* --- SECCIÓN 2: CUADRÍCULA DE POSTS (Animada) --- */}
      <section className="w-full max-w-6xl px-4 py-20">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible" // Se anima al hacer scroll
          viewport={{ once: true, amount: 0.5 }} // Se anima una vez
        >
          Nuestros Artículos
        </motion.h2>
        
        {/* NUEVO: Contenedor 'stagger' para la cuadrícula */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Inicia al ver el 20%
        >
          {posts.map((post) => (
            // NUEVO: Cada tarjeta es un hijo 'staggered'
            <motion.div key={post.id} variants={fadeInUp}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- SECCIÓN 3: CTA DE TIENDA (¡NUEVA SECCIÓN!) --- */}
      <motion.section 
        className="w-full bg-amber-100 py-20" // <-- ¡NUEVO COLOR!
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* ¡NUEVO TÍTULO Y TEXTO! */}
          <h2 className="text-4xl font-bold mb-6 text-amber-900">
            Del Blog a tu Cocina
          </h2>
          <p className="text-lg text-amber-800 leading-relaxed mb-10">
            ¿Inspirado por nuestras recetas? Encuentra todos los superfoods,
            granos y productos de los que hablamos, directamente en nuestra tienda.
          </p>
          {/* ¡NUEVA ACCIÓN! (Botón de Link) */}
          <Link 
            href="/tienda" 
            className="inline-block bg-green-700 text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
          >
            Explorar la Tienda
          </Link>
        </div>
      </motion.section>

    </main>
  );
}