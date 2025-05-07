'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    console.log('Inscription envoyée :', formData);
    //envoy les données vers ton backend AdonisJS ici
  };

  return (
    <main className="relative min-h-screen text-black flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-white">
       <Link href="/" className="flex items-center text-white hover:underline absolute top-4 left-4 ">
       <ArrowLeft className="w-5 h-5 mr-1" />
       Retour à l’accueil
       </Link>
       <motion.div
        className="w-1/2 flex justify-center rounded-full overflow-hidden"
        animate={{ rotate: 30 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        
      >
        <Image
          src="/Tdp.png"
          alt="Logo animé"
          width={250}
          height={150}
        />
        </motion.div>
      <form onSubmit={handleSubmit} className="bg- p-8 rounded shadow-md w-full max-w-md text-black">
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">Créer un compte</h2>

        <input
          name="firstName"
          type="text"
          placeholder="Prénom"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <input
          name="lastName"
          type="text"
          placeholder="Nom"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <input
          name="phoneNumber"
          type="tel"
          placeholder="Numéro de téléphone"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-6"
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          S’inscrire
        </button>
       
        <p className="text-sm text-center mt-4">
           Vous avez déjà un compte ?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
              Se connecter
          </a>
         </p>
      </form>
    </main>
  );
}
