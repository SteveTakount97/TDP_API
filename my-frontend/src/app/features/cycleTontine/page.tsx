'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RotateCw, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/axios'
import Header from '@/component/header'

interface Cycle {
  id: string
  status: string
  startDate: string
  endDate: string
  tontine: {
    name: string
    amountPerCycle: number
  }
}
const format = (amountPerCycle: number) => {
  return amountPerCycle.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
};

export default function CyclesPage() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        const response = await api.get("/Cycle-tontine")
        setCycles(response.data)
        console.log('data', response.data)
      } catch (error: any) {
        const errormessage = error.response?.data?.message || error.message || 'Erreur inconnue'
        console.error('Erreur lors du fetch des cycles :', errormessage)
      }
    }

    fetchCycle()
  }, [])

  const handleClick = (id: string) => {
    router.push(`/features/payment/${id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'actif':
        return 'bg-green-100 text-green-700'
      case 'terminé':
        return 'bg-gray-200 text-gray-600'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <>
     <Header/>
    <main className="min-h-screen bg-black p-6">
        <header className="bg-black text-white shadow-md relative">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Gestion de Mes Paiements</h1>
          <Link href="/features/tontine/create" className="flex items-center gap-2 bg-primary border px-4 py-2 rounded-lg text-sm shadow-sm transition">
         <PlusCircle className="w-4 h-4 bg-green-600 text-purple-800" />
            Effectuer Un Versement
          </Link>
        </div>
      </header>
      <Tabs defaultValue="cycles" className="w-full max-w-5xl mx-auto">
       

        <TabsContent value="cycles">
          <Card className="rounded-2xl shadow-lg border bg-black cursor-pointer">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-white">Historique des cycles</h2>
              <ul className="space-y-6">
                {cycles.map((cycle) => (
                  <li
                    key={cycle.id}
                    className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                  >
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Tontine :</span>
                        <span>{cycle.tontine?.name ?? 'Non spécifiée'}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Montant par cycle :</span>
                        <span className='text-black'>{new Intl.NumberFormat('fr-FR').format(cycle.tontine.amountPerCycle)} FCFA</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Période :</span>
                        <span>
                          {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Statut :</span>
                        <Badge className={`capitalize ${getStatusColor(cycle.status)}`}>
                          {cycle.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleClick(cycle.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                      >
                        Effectuer un versement
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
       
        </TabsContent>
      </Tabs>
    </main>
    </>
  )
}
