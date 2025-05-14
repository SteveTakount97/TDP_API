'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarCheck, RotateCw, PlusCircle, Edit, Eye, Trash, Users } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'


interface Tontine {
  id: string
  name: string
  description?: string
  amountPerCycle: number
  frequency: string
  type: string
  startDate: string
}

interface Member {
  id: string
  name: string
  role: string
}

interface Cycle {
  id: string
  status: string
  startDate: string
  endDate: string
}

export default function TontinePage() {
  const [tontines, setTontine] =  useState<Tontine[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([])
  
 //state pour modifier une tontine
  const [editingTontine, setEditingTontine] = useState<Tontine | null>(null)
  const [newName, setNewName] = useState<string>('tontine')
  const [newDrescription, setNewDescription] = useState<string>('tontine')

 //state pour supprimer une tontine
 const [deleteingTontine, setdeletingTontine] = useState<Tontine | null>(null)

  useEffect(() => {
    const fetchtontine = async () => {
    try {
      const response = await api.get('/tontine/') 
      const tontineData = response.data

      setTontine(tontineData)
      console.log('dataTontine', tontineData)
    } catch (error: any) {
      console.error('Erreur lors du fetch de la tontine:', error.response?.data || error.message)
    }
  }
   const fetchCycle = async () => {
    try {
      const response = await api.get("/Cycle-tontine") 
      const cycleData = response.data
      setCycles(cycleData)
      console.log('data', cycleData)
    } catch (error: any) {
       const errormessage = error.response?.data?.message || error.message || 'Erreur inconnue'
     console.error('Erreur lors du fetch des membres de la tontine:', errormessage)
    }
  }
  fetchtontine()
  fetchCycle()
  }, [])
 
 const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/features/member/${id}`);
  };
  
  //fontion pour supprimer une Tontine
  const handleDeleteTontine = async (tontines: any) =>{
     const tontineId = deleteingTontine?.id
     if (!tontineId){
      alert("Aucune tontine selectionné")
     }
     try {
      await api.delete(`/tontine/${tontineId}`)

       alert("Tontine Supprimé")
     setEditingTontine(null)
     
     }
    
    catch (error){
    console.error('Erreur los de la suppression de la tontine', error)
    alert("Une erreur est survenu")
  }
  }
  //select tontine
  const selectTontine = (tontine: any)=>{
    setdeletingTontine(tontine)
  }
 
  //fonction pour mettre à jour les données d'une tontine
  const handleUpdateTontine = async () => {

  const tontineId = editingTontine?.id
   if (!tontineId){
    return
   } 
   try{
       await api.put(`/tontine/${tontineId}`, {
        name : newName,
        description: newDrescription,
       })
       alert("Tontine mis à jour avec succes")
       setEditingTontine(null)

   } catch(error){
    console.error("erreur lors de la mise à jour de la tontine")
    alert("erreur lors de la mise à jour")
   }
   
  }
  //fonction pour edit le role d'un membre
  const handleEditTontine = (tontine: any) => {
  setEditingTontine(tontine)
  setNewName(tontine.name)
  setNewDescription(tontine.description)
   }
  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <Link href="/acceuil" className="flex items-center text-black hover:underline absolute top-4 left-4 ">
       <ArrowLeft className="w-5 h-5 mr-1" />
       Retour 
       </Link>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Mes Tontines</h1>
          <Link href="/features/tontine/create" className="flex items-center gap-2 text-black bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm shadow-sm transition">
            <PlusCircle className="w-4 h-4 bg-green-600 text-purple-800" />
            Créer Une Nouvelle tontine
          </Link>
        </div>
      </header>
     
      {/* Contenu principal */}
      <main className="p-6 max-w-6xl mx-auto space-y-6">
         <Tabs defaultValue="tontines" className="w-full text-black">
        <TabsList className="mb-4 gap-4">
          <TabsTrigger value="Tontines" className="flex items-center gap-1 hover:text-red-500 cursor-pointer shadow-2xl">
            <RotateCw className="h-4 w-4" />
            Mes Tontine
          </TabsTrigger>
        </TabsList>
      </Tabs>  
        {tontines.length > 0 ? (
          tontines.map((tontine:any) => (
            <Card key={tontine.id} className="shadow-sm border border-gray-200 rounded-2xl hover:shadow-md transition duration-200">
              <CardContent className="p-6 space-y-4 cursor-pointer">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{tontine.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{tontine.description}</p>
                  </div>
                  <Badge className="text-xs mt-2 md:mt-0 capitalize text-green-500" variant="outline">
                    {tontine.type}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4 text-primary" />
                    <span>Montant / cycle : <strong>{tontine.amountPerCycle} €</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                    <span>Fréquence : <strong>{tontine.frequency}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                    <span>Début : <strong>{new Date(tontine.startDate).toLocaleDateString()}</strong></span>
                  </div>
                </div>
                 <div className="flex gap-4 mt-4 cursor-pointer">
                  <button onClick={() => handleEditTontine(tontine)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                    <Edit className="h-5 w-5" />
                    Modifier
                  </button>
                  <button onClick={() => handleClick(tontine.id)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                    <Users className="h-5 w-5" />
                    Voir les membres
                  </button>
                  <button onClick={() => selectTontine(tontine)}className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 cursor-pointer">
                    <Trash className="h-5 w-5" />
                    Supprimer
                  </button>
                 </div> 
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-12">Aucune tontine trouvée.</p>
        )}
        <Tabs defaultValue="members" className="w-full text-black">
        <TabsList className="mb-4 gap-4">
          <TabsTrigger value="cycles" className="flex items-center gap-1 hover:text-red-500 cursor-pointer shadow-2xl">
            <RotateCw className="h-4 w-4" />
            Cycles Tontines
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cycles">
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 cursor-pointer">Historique des cycles</h3>
              <ul className="space-y-3">
                {cycles.map((cycle) => (
                  <li
                    key={cycle.id}
                    className="border rounded-lg p-4 text-sm hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-center cursor-pointer">
                      <span className="text-black ">
                        Période : {new Date(cycle.startDate).toLocaleDateString()} -{' '}
                        {new Date(cycle.endDate).toLocaleDateString()}
                      </span>
                      <Badge className="text-xs capitalize text-green-600 cursor-pointer">{cycle.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

   {/**modale edit le nom et la description d'une tontine */}
    {editingTontine && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Modifier Une Tontine
      </h2>
       <h3 className="text-black font-bold text-xl">{editingTontine.name}</h3>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-600">Nouveau Nom</label>
        <input
        type='text'
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-500"
        >
        </input>
      </div>
       <h3 className="text-black font-bold text-xl">{editingTontine.description}</h3>
       <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-600">Nouvelle description</label>
        <textarea
        
          value={newDrescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-500"
        >
        </textarea>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setEditingTontine(null)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm cursor-pointer"
        >
          Annuler
        </button>
        <button
          onClick={handleUpdateTontine}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm cursor-pointer"
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
)}

{deleteingTontine && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Voulez-vous vraiement supprimer cette Tontine? 
      </h2>
      <h3 className="text-black font-bold text-xl">{deleteingTontine.name}</h3><hr />
      <p className="text-gray-700 font-bold text-xl">{deleteingTontine.description}</p>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setdeletingTontine(null)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm cursor-pointer"
        >
          Annuler
        </button>
        <button
          onClick={handleDeleteTontine}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm cursor-pointer shadow-2xl font-bold"
        >
         Supprimer
        </button>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
)
  }