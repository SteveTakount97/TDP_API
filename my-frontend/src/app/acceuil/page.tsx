'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banknote, User, UsersRound } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import axios from 'axios';
import Features from '@/component/fonctionnalite';
import Drawer from '@/component/Drawer';


type User = {
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
  
    if (!token || !storedUser) {
      return;
    }
  
    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (e) {
      console.error("Erreur lors du parsing de l'utilisateur :", e);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const [activeDrawer, setActiveDrawer] = useState<'tontines' | 'payments' | 'users' | null>(null)

  const openDrawer = (type: 'tontines' | 'payments' |'users') => {
    setActiveDrawer(type)
  }

  const closeDrawer = () => {
    setActiveDrawer(null)
  }

  const handleLogout = () => {
    console.log("Déconnexion déclenchée");
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file); 
  
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.post('http://localhost:3333/api/users/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Payload envoyé :", formData);
      console.log("Photo de profil mise à jour :", response.data);

       // Mettre à jour l'état avec la nouvelle image
       setUser((prevUser) =>
        prevUser
      ? { ...prevUser,profileImageUrl: response.data.imageUrl }
      : null
       );
      // Facultatif : mettre à jour le localStorage
      const updatedUser = { ...user, profileImageUrl: response.data.imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo de profil :", error);
    }
  };
  
  const CardShortcut = ({ onClick, icon, title, description, bgHover }: any) => (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl shadow transition duration-300 cursor-pointer hover:shadow-lg ${bgHover}`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
  
  return (
 
    <main className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bienvenue, {user?.fullName || 'Utilisateur'} 👋</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition "
        >
          Se déconnecter
        </button>
      </header>
      <section className="px-4 py-6">
   <div className="grid grid-cols-1 md:grid-cols gap-6">
   <div className="bg-white shadow-md rounded-xl p-6 text-black flex flex-col md:flex-row justify-between items-start gap-6">
  {/* Colonne gauche : Infos utilisateur */}
  <div className="flex-1 flex flex-col items-center md:items-start">
    <h2 className="text-2xl font-semibold mb-6 self-center md:self-start">Vos informations</h2>

    {/* Avatar */}
    <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 mb-4">
      {user?.profileImageUrl ? (
        <img
          src={`http://localhost:3333${user.profileImageUrl}`}
          alt="Photo de profil"
          className="w-full h-full "
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Pas de photo
        </div>
      )}
    </div>

    {/* Upload fichier */}
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Modifier la photo
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="mb-6 block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-indigo-50 file:text-indigo-700
        hover:file:bg-indigo-100"
    />

    {/* Infos utilisateur */}
    <div className="text-sm space-y-2">
      <p><strong>Nom :</strong> {user?.fullName}</p>
      <p><strong>Email :</strong> {user?.email}</p>
      <p><strong>Téléphone :</strong> {user?.phoneNumber}</p>
    </div>
  </div>

  {/* Texte de bienvenue (au centre) */}
  <div className="hidden md:flex flex-col justify-center items-center px-4">
    <p className="text-lg text-gray-700 font-medium text-center">
      Bienvenue sur votre espace personnel 👋
    </p>
  </div>

  {/* Colonne droite : Logo animé */}
  <motion.div
    className="w-[250px] flex justify-center rounded-full overflow-hidden self-center md:self-start"
    animate={{ rotate: 30 }}
    transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
  >
    <Image
      src="/Tdp.png"
      alt="Logo animé"
      width={250}
      height={250}
      className="w-50 h-auto"
    />
  </motion.div>
</div>

    {/* Bloc raccourcis */}
    <motion.div
  className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 "
  animate={{ x: [0, -20, 0] }} 
               transition={{
                    duration: 3,
                    repeat: Infinity,       
                    repeatType: 'loop',    
                    ease: 'easeInOut',
                    }}
                  viewport={{ once: true }}
                  
>
  <CardShortcut
     onClick={() => openDrawer('tontines')}
    icon={<Banknote className="text-blue-600 w-8 h-8" />}
    title="Tontines"
    description="Créer et gérer vos tontines"
    bgHover="hover:bg-blue-50"
  />

  <CardShortcut
    onClick={() => openDrawer('payments')}
    icon={<User className="text-green-600 w-8 h-8" />}
    title="Paiements"
    description="Suivre les contributions"
    bgHover="hover:bg-green-50"
  />

  <CardShortcut
    onClick={() => openDrawer('users')}
    icon={<UsersRound className="text-purple-600 w-8 h-8" />}
    title="Utilisateurs"
    description="Gérer les membres"
    bgHover="hover:bg-purple-50"
  />
</motion.div>
  </div>
   <Drawer activeDrawer={activeDrawer} closeDrawer={closeDrawer} />  
 </section>
 <Features />
    </main>
    
   
  );
}
