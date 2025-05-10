import { X, PlusCircle, Users, History, CreditCard, Receipt, Bell, Pencil, Trash2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { label } from 'framer-motion/client'

type DrawerProps = {
  activeDrawer: 'tontines' | 'payments' | 'users' | null
  closeDrawer: () => void
}

export default function Drawer({ activeDrawer, closeDrawer }: DrawerProps) {
  if (!activeDrawer) return null

  const menuItems =
    activeDrawer === 'tontines'
      ? [
          { icon: <PlusCircle className="w-4 h-4 text-amber-200" />, label: 'Créer une tontine' },
          { icon: <Users className="w-4 h-4 text-blue-300" />, label: 'Mes groupes' },
          { icon: <History className="w-4 h-4 text-gray-700" />, label: 'Historique' },
          {icon: <Pencil className="w-4 h-4 text-blue-600" />, label: "Modifier une Tontine"},
          {icon: <Trash2 className="w-4 h-4 text-red-600" />, label: 'Supprimer une Tontine'},
          { icon: <Eye className="w-4 h-4 text-gray-700" />, label: 'Voir le Detail d/une Tontine'},
        ]
      : activeDrawer === 'payments'
      ? [
          { icon: <CreditCard className="w-4 h-4 text-gray-700" />, label: 'Mes paiements' },
          { icon: <Receipt className="w-4 h-4 text-amber-200" />, label: 'Reçus' },
          { icon: <Bell className="w-4 h-4 text-red-500" />, label: 'Alertes' },
        ]
         : activeDrawer === 'users'
          ? [
          { icon: <CreditCard className="w-4 h-4" />, label: 'Mon Compte' },
          { icon: <Receipt className="w-4 h-4" />, label: 'Status Payment Reçu' },
          { icon: <Bell className="w-4 h-4" />, label: 'Alertes' },
        ]
      : []

  return (
    <div className="fixed top-0 right-0  inset-0 z-40 flex" onClick={closeDrawer}>
      {/* Overlay */}
      <div className="w-full backdrop-blur-sm bg-black/30" />

      {/* Drawer */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-72 h-full bg-white rounded-r-2xl shadow-xl p-6 z-50 animate-slide-in"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {activeDrawer}
          </h2>
          <button
            onClick={closeDrawer}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <ul className="space-y-4">
          {menuItems.map(({ icon, label }, index) => (
            <li
              key={index}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition"
            >
              {icon}
              <span className="text-sm">{label}</span>
            </li>
          ))}
        </ul>
          <motion.div
        className="w-1/2 flex justify-center rounded-full overflow-hidden mt-50"
        animate={{ rotate: 40 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        
      >
        <Image
          src="/Tdp.png"
          alt="Logo animé"
          width={150}
          height={150}
        />
        </motion.div>
      <div className="absolute bottom-0 w-full h-20 border-t px-4 py-3 bg-purple flex justify-between items-center bg-gray-400 hover:text-gray-900 transition-colors">
       <button
       onClick={closeDrawer}
       className="bg-white text-blue-700 font-semibold px-5 py-2 rounded hover:bg-amber-600 shadow-lg "
      >
          Fermer
        </button>
      <span className="text-xl text-black">© 2025 MonApp</span>
      </div>

      </div>
    </div>
  )
}
