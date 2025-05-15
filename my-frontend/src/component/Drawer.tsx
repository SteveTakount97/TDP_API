import { X, PlusCircle, Users, History, CreditCard, Receipt, Bell, Pencil, Trash2, Eye, Send, UserX, FileText, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'



type DrawerProps = {
  activeDrawer: 'tontines' | 'payments' | 'users' | null
  closeDrawer: () => void
}

export default function Drawer({ activeDrawer, closeDrawer }: DrawerProps) {
  if (!activeDrawer) return null
  const router = useRouter()

  const menuItems =
    activeDrawer === 'tontines'
      ? [
          { icon: <PlusCircle className="w-4 h-4 text-amber-200" />, label: 'Créer une tontine', path: 'features/createTontine' },
          { icon: <Users className="w-4 h-4 text-blue-300" />, label: 'Mes groupes', path: 'features/tontine' },
          { icon: <History className="w-4 h-4 text-gray-700" />, label: 'Historique' },
          {icon: <Pencil className="w-4 h-4 text-blue-600" />, label: "Modifier une Tontine", path: 'features/tontine'},
          {icon: <Trash2 className="w-4 h-4 text-red-600" />, label: 'Supprimer une Tontine'},
          { icon: <Eye className="w-4 h-4 text-gray-700" />, label: "Voir le Detail d'une Tontine"},
        ]
      : activeDrawer === 'payments'
      ? [
          { icon: <CreditCard className="w-4 h-4 text-gray-700" />, label: 'Mes paiements' },
          { icon: <Receipt className="w-4 h-4 text-amber-200" />, label: 'Reçus' },
          { icon: <Send className="w-4 h-4 text-green-500" />, label: "Envoyer de L'argent" },
          { icon: <Eye className="w-4 h-4 text-gray-700" />, label: "Voir le Detail d'une Transaction"},
          { icon: <Bell className="w-4 h-4 text-red-500" />, label: 'Alertes' },
        ]
         : activeDrawer === 'users'
          ? [
          { icon: <FileText className="w-4 h-4 text-green-600" />, label: 'Mes Informations' },
          { icon: <Receipt className="w-4 h-4" />, label: 'Status Payment Reçu' },
          { icon: <UserX className="w-4 h-4 text-red-600" />, label: "Désactiver Mon Compte"},
          { icon: <Settings className="w-4 h-4 text-gray-900" />, label: 'Paramètres' },
          { icon: <Bell className="w-4 h-4 text-red-500" />, label: 'Alertes' },
        ]
      : []
   
  const handleNavigate = (path: any) => {
    closeDrawer()
    router.push(path)
  }
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
          {menuItems.map(({ icon, label, path }, index) => (
            <li
              key={index}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer transition"
            >
              {icon}
              <button className="text-sm cursor-pointer"    onClick={() => handleNavigate(path)}>{label}</button>
            </li>
          ))}
        </ul>
          <motion.div
        className="w-full flex justify-center rounded-full overflow-hidden mt-50"
        animate={{ rotate: 40 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        
      >
        <Image
          src="/Tdp.png"
          alt="Logo animé"
          width={100}
          height={100}
        />
        </motion.div>
      <div className="absolute bottom-0 flex-col h-20 border-t px-4 py-3 bg-purple flex justify-between items-center hover:text-gray-900 transition-colors">
       <button
       onClick={closeDrawer}
       className="bg-white text-blue-700 font-semibold px-5 py-2 rounded hover:bg-amber-600 shadow-lg cursor-pointer "
      >
          Fermer
        </button>
      <span className="text-xl text-blue-700">©TDP DIGITALE</span>
      </div>

      </div>
    </div>
  )
}
