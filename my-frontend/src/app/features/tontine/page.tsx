'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarCheck, RotateCw, PlusCircle, Edit, Eye, Trash, Users } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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

  useEffect(() => {
    const fetchtontine = async () => {
    try {
      const tontine = await api.get('/tontine/') 
      const tontineData = tontine.data
      setTontine(tontine.data)
      console.log('data', tontineData)
    } catch (error: any) {
      console.error('Erreur lors du fetch de la tontine:', error.tontine?.data || error.message)
    }
  }
   const fetchmember = async () => {
    try {
      const cycles = await api.get("/Cycle-tontine") 
      const cycleData = cycles.data
      setCycles(cycleData)
      console.log('data', cycleData)
    } catch (error: any) {
       const errormessage = error.response?.data?.message || error.message || 'Erreur inconnue'
     console.error('Erreur lors du fetch des membres de la tontine:', errormessage)
    }
  }
  fetchtontine()
  fetchmember()
  }, [])

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
          <Link href="/features/create" className="flex items-center gap-2 text-black bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm shadow-sm transition">
            <PlusCircle className="w-4 h-4 bg-green-600 text-purple-800" />
            Nouvelle tontine
          </Link>
        </div>
      </header>
       
      {/* Contenu principal */}
      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {tontines.length > 0 ? (
          tontines.map((tontine) => (
            <Card key={tontine.id} className="shadow-sm border border-gray-200 rounded-2xl hover:shadow-md transition duration-200">
              <CardContent className="p-6 space-y-4 cursor-pointer">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{tontine.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{tontine.description}</p>
                  </div>
                  <Badge className="text-xs mt-2 md:mt-0 capitalize" variant="outline">
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
                 <div className="flex gap-4 mt-4">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    <Edit className="h-5 w-5" />
                    Modifier
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    <Eye className="h-5 w-5" />
                    Voir le détail
                  </button>
                  <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800">
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
          <TabsTrigger value="cycles" className="flex items-center gap-1">
            <RotateCw className="h-4 w-4" />
            Cycles Tontines
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cycles">
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Historique des cycles</h3>
              <ul className="space-y-3">
                {cycles.map((cycle) => (
                  <li
                    key={cycle.id}
                    className="border rounded-lg p-4 text-sm hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Période : {new Date(cycle.startDate).toLocaleDateString()} -{' '}
                        {new Date(cycle.endDate).toLocaleDateString()}
                      </span>
                      <Badge className="text-xs capitalize">{cycle.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </main>
    </div>
  )
}