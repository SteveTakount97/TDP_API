// app/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Features from '@/component/fonctionnalite';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row justify-center items-center  justify-between  py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white to-purple-600 ">
        {/* Image à gauche avec animation */}
      <motion.div
        className="w-1/2 flex justify-center rounded-full overflow-hidden"
        animate={{ rotate: 40 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        
      >
        <Image
          src="/Tdp.png"
          alt="Logo animé"
          width={250}
          height={250}
        />
        </motion.div>
      <div className="w-full md:w-1/2 mt-10 md:mt-0 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 w-full md:w-1/2 mt-10 md:mt-0 text-center md:text-left">Bienvenue sur TDP</h1>
        <p className="text-lg md:text-xl mb-6 max-w-xl">
          Une plateforme moderne pour gérer vos tontines de manière simple, sécurisée et collaborative.
        </p>
      
          <Link href="/auth/register" className="bg-white text-blue-700 font-semibold px-5 py-2 rounded hover:bg-gray-100 shadow-lg ">
            Créer votre Tontine
          </Link>
          
        </div>
      </section>

      {/* Features Section */}
     <Features />
    </main>
  );
}
