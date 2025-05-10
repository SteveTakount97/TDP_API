'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    console.log('Tentative de connexion :', formData);
    //envoy les données au backend pour authentification
    const data = {
      email: formData.email,
      password: formData.password,
    }
    try {
      const response = await api.post('http://localhost:3333/api/login', data);
      console.log('Réponse de la requête:', response);

      // Vérifier que la réponse contient bien un token
      if (response && response.data && response.data.token.token) {
        // Sauvegarder le token dans le localStorage
        const token = response.data.token.token
        console.log(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        console.log('infos user', response.data.user);
  
        alert('Connexion réussie');
  
        // Redirection vers la page d'accueil
        router.push('/acceuil');
      } else {
        // Si la réponse ne contient pas de token
        setError('Erreur : Pas de token reçu');
        console.error('Erreur : Pas de token reçu', response);
      }
  
    } catch (err) {
      // Gérer les erreurs d'API ou autres erreurs
      setError('Erreur de connexion : ');
      console.error('Erreur de connexion:', err);
    }
  

  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 h-screen w-full bg-white bg-opacity-50 text-white">
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
          height={250}
          className="w-24 h-auto"
        />
        </motion.div>
      <form onSubmit={handleSubmit} className="bg- p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Connexion</h2>

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
          className="w-full p-2 border rounded mb-6"
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Se connecter
        </button>

        <p className="text-sm text-center mt-4">
          Pas encore de compte ?{' '}
          <a href="/auth/register" className="text-white hover:underline">
            S’inscrire
          </a>
        </p>
      </form>
    </main>
  );
}
