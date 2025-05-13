'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import api from '@/lib/axios'


interface ErrorBag {
  [key: string]: string[] // ex: name: ["Le nom est requis."]
}

export default function CreateTontineForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amountPerCycle: '',
    frequency: '',
    type: '',
    start_date: '',
  })

  const [errors, setErrors] = useState<ErrorBag>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
    const newState = { ...prev, [name]: value };
    console.log(newState);  // Vérifier l'état mis à jour
    return newState;
  });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

  const dataForm = {
      name: formData.name,
      description: formData.description,
      amountPerCycle: Number(formData.amountPerCycle),
      frequency: formData.frequency,
      type: formData.type,
      startDate: formData.start_date,
  }  
  console.log('donnée envoyer', dataForm)
    try {
      const res = await api.post('http://localhost:3333/api/tontines', dataForm)
       console.log('donnée envoyer', res);
      if (res) {
        router.push('features/tontine') 
      } 
      else {
        setErrors(res|| {})
      }
    } catch (err:any) {
      console.error('Erreur réseau', err.response.data)
       setErrors(err.response.data.errors || {});
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className='flex justify-center'>
     <Link href="/acceuil" className="flex items-center text-black hover:underline absolute top-4 left-4 ">
       <ArrowLeft className="w-5 h-5 mr-1" />
       Retour
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
          className="w-50 h-auto items-center"
        />
        </motion.div>
     </div>   
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white text-black shadow-xl p-8 rounded-2xl max-w-xl mx-auto mt-8 cursor-pointer"
    >
      <h2 className="text-2xl font-bold mb-4">Créer une nouvelle tontine</h2>

      <div>
        <label htmlFor="name">Nom de la tontine</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex : Tontine du quartier"
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          placeholder="Ex : Cette tontine regroupe les membres du quartier..."
          required
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
      </div>

      <div>
        <label htmlFor="amount">Montant par cycle (FCFA)</label>
        <input
          id="amount"
          name="amountPerCycle"
          type="number"
          value={formData.amountPerCycle}
          onChange={handleChange}
          placeholder="Ex : 100"
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          required
        />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount[0]}</p>}
        </div>
     
       <div>
  <label htmlFor="frequency">Fréquence</label>
  <select
    id="frequency"
    name="frequency"
    value={formData.frequency}
    onChange={handleSelectChange}
    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
  >
    <option value="">-- Sélectionnez une fréquence --</option>
    <option value="hebdomadaire">Hebdomadaire</option>
    <option value="mensuelle">Mensuelle</option>
    <option value="trimestrielle">Trimestrielle</option>
  </select>
  {errors.frequency && (
    <p className="text-red-500 text-sm mt-1">{errors.frequency[0]}</p>
  )}
</div>

<div className="mt-4">
  <label htmlFor="type">Type de Tontine</label>
  <select
    id="type"
    name="type"
    value={formData.type}
    onChange={handleSelectChange}
    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
  >
    <option value="">-- Sélectionnez un type --</option>
    <option value="solidaire">Solidaire</option>
    <option value="rotative">Rotative</option>
  </select>
  {errors.type && (
    <p className="text-red-500 text-sm mt-1">{errors.type[0]}</p>
     )}
     </div>

      <div>
        <label htmlFor="start_date">Date de début</label>
        <input
          id="start_date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        />
        {errors.start_date && (
          <p className="text-red-500 text-sm mt-1">{errors.start_date[0]}</p>
        )}
      </div>

      <button type="submit" className="w-full text-blue-700 font-semibold px-5 py-2 rounded hover:bg-amber-500 shadow-lg cursor-pointer" disabled={loading}>
        {loading ? 'Création en cours...' : 'Créer la tontine'}
      </button>
    </form>
   </> 
  )
}
