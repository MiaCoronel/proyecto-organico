// app/components/TiendaContenido.js
"use client"; 

import React, { useState, useEffect, useMemo } from 'react'; 
import Image from 'next/image';
import Link from 'next/link'; 
import { motion } from 'framer-motion';

// Importamos los componentes hijos
import ProductCard, { fadeInUp } from './ProductCard';
import FilterGroup from './FilterGroup';

// Definimos las categorías
const categories = ["Super Foods", "Despensa Saludable", "Bienestar", "Cuidado Personal"];

// Animaciones
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
      ease: 'easeOut'
    }
  }
};

export default function TiendaContenido({ allProducts, initialCategory = 'Todos' }) {
  
  // --- ESTADOS DE FILTROS ---
  
  // 1. Categorías: Si viene una categoría inicial (y no es 'Todos'), la ponemos en el array.
  // Si es 'Todos', empezamos con array vacío (que significa "sin filtro de categoría").
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory && initialCategory !== 'Todos' ? [initialCategory] : []
  );

  const [sortOrder, setSortOrder] = useState('popularidad');
  const [filteredProducts, setFilteredProducts] = useState(allProducts); 

  // --- OTROS ESTADOS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [showInStock, setShowInStock] = useState(false);
  const [minPrice, setMinPrice] = useState(''); 
  const [maxPrice, setMaxPrice] = useState(''); 

  // Calculamos precio máximo para el placeholder
  const maxPossiblePrice = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return 100; 
    return Math.ceil(Math.max(...allProducts.map(p => p.precio))); 
  }, [allProducts]);


  // --- LÓGICA DE FILTROS PRINCIPAL ---
  useEffect(() => {
    let products = [...allProducts];

    // 1. Filtro por Búsqueda
    if (searchTerm) {
      products = products.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filtro por Stock
    if (showInStock) {
      products = products.filter(p => p.stock > 0);
    }

    // 3. Filtro por Categoría
    // Si hay categorías seleccionadas, filtramos. Si el array está vacío, mostramos todo.
    if (selectedCategories.length > 0) {
      products = products.filter(p => selectedCategories.includes(p.categoria));
    }

    // 4. Filtro por Precio
    const numMinPrice = parseFloat(minPrice);
    const numMaxPrice = parseFloat(maxPrice);

    if (!isNaN(numMinPrice) && numMinPrice >= 0) {
      products = products.filter(p => p.precio >= numMinPrice);
    }
    if (!isNaN(numMaxPrice) && numMaxPrice > 0) {
      products = products.filter(p => p.precio <= numMaxPrice);
    }
    
    // 5. Ordenamiento
    switch (sortOrder) {
      case 'precio-asc':
        products.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
        break;
      case 'precio-desc':
        products.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
        break;
      case 'nombre-asc':
        products.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default: 
        products.sort((a, b) => a.id - b.id);
        break;
    }
    
    setFilteredProducts(products);
  }, [selectedCategories, sortOrder, allProducts, searchTerm, showInStock, minPrice, maxPrice]);

  // Manejo de checkbox de categorías
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  // Limpiar filtros
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
    setShowInStock(false);
    setMinPrice('');
    setMaxPrice('');
    setSortOrder('popularidad');
    // Opcional: Limpiar la URL si quieres que se vea limpia
    window.history.replaceState(null, '', '/tienda');
  };

  return (
    <>
      {/* --- HERO --- */}
      <section className="relative w-full h-[50vh] flex items-center justify-center text-center text-white -mt-16">
        <Image
          src="/img/tienda-hero.webp"
          alt="Productos orgánicos en una mesa"
          fill={true}
          className="brightness-50 object-cover"
          priority
        />
        <motion.div 
          className="relative z-10 max-w-3xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Nuestra Tienda
          </h1>
          <p className="text-xl md:text-2xl">
            Descubre la colección completa de productos orgánicos.
          </p>
        </motion.div>
      </section>

      {/* --- CUERPO PRINCIPAL --- */}
      <div className="w-full max-w-full mx-auto py-16 px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row gap-10">
        
        {/* SIDEBAR DE FILTROS */}
        <motion.aside 
          className="w-full lg:w-1/4 xl:w-1/5 bg-white p-6 rounded-lg shadow-lg self-start sticky top-24"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Filtros</h2>
            <button 
              onClick={clearAllFilters} 
              className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
            >
              Limpiar todo
            </button>
          </div>
          
          {/* Filtro de Búsqueda */}
          <div className="mb-6">
            <label htmlFor="search" className="block text-lg font-semibold text-gray-800 mb-2">Buscar</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej. Quinua, Maca..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filtro de Categoría */}
          <FilterGroup
            title="Categoría"
            options={categories}
            selected={selectedCategories}
            onChange={handleCategoryChange}
          />
          
          {/* Filtro de Precio */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Precio (S/.)</h3>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 [appearance:textfield]"
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={`Max (${maxPossiblePrice})`}
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 [appearance:textfield]"
              />
            </div>
          </div>

          {/* Filtro de Stock */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Disponibilidad</h3>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="in-stock"
                checked={showInStock}
                onChange={(e) => setShowInStock(e.target.checked)}
                className="h-5 w-5 rounded text-green-600 focus:ring-green-500"
              />
              <label htmlFor="in-stock" className="text-sm text-gray-700">
                Mostrar solo en stock
              </label>
            </div>
          </div>
          
        </motion.aside>

        {/* LISTA DE PRODUCTOS */}
        <main className="w-full lg:w-3/4 xl:w-4/5">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-sm text-gray-600 w-full md:w-auto">
              {filteredProducts.length > 0
                ? `Mostrando ${filteredProducts.length} productos`
                : `No se encontraron productos`
              }
            </p>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-auto"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="popularidad">Popularidad</option>
              <option value="precio-asc">Precio: Más bajo a más alto</option>
              <option value="precio-desc">Precio: Más alto a más bajo</option>
              <option value="nombre-asc">Alfabéticamente, A-Z</option>
            </select>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            key={filteredProducts.length} // Clave para reiniciar animación al filtrar
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600">No se encontraron productos que coincidan con tus filtros.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-green-600 font-semibold hover:text-green-800"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
            
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </main>
      </div>

      {/* CTA SECTION */}
      <section className="w-full bg-white py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Únete a la Comunidad Allin Runa</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            ¿Inspirado por nuestra historia? Recibe más relatos de nuestros productores, recetas saludables y acceso anticipado a nuevos productos.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Tu correo electrónico"
              className="px-6 py-4 rounded-full text-gray-800 w-full md:flex-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
            <button 
              type="submit"
              className="bg-green-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </>
  );
}