'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CalendarCheck, RotateCw } from 'lucide-react'
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
  const [members, setMembers] = useState<Member[]>([])
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
      const member = await api.get("/tontine-memberships") 
      const memberData = member.data[0] 
      setMembers(memberData)
      console.log('data', memberData)
    } catch (error: any) {
       const errormessage = error.response?.data?.message || error.message || 'Erreur inconnue'
     console.error('Erreur lors du fetch des membres de la tontine:', errormessage)
    }
  }
  fetchtontine()
  fetchmember()
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 ">
      <h1 className="text-4xl font-bold text-gray-800">Tontine</h1>

{tontines.length > 0 ? (
  tontines.map((tontine) => (
    <Card key={tontine.id} className="shadow-md border rounded-xl mb-4">
      <CardContent className="p-6 space-y-4 cursor-pointer">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{tontine.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{tontine.description}</p>
          </div>
          <Badge className="text-xs mt-2 md:mt-0" variant="outline">
            {tontine.type}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <RotateCw className="h-4 w-4 text-primary" />
            <span>Montant / cycle : <strong>{tontine.amountPerCycle} €</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <span>Fréquence : <strong>{tontine.frequency}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <span>Début : <strong>{new Date(tontine.startDate).toLocaleDateString()}</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  ))
) : (
  <p className="text-gray-500">Aucune tontine trouvée.</p>
)}
    
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="mb-4 gap-4">
          <TabsTrigger value="members" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Membres
          </TabsTrigger>
          <TabsTrigger value="cycles" className="flex items-center gap-1">
            <RotateCw className="h-4 w-4" />
            Cycles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Liste des membres</h3>
              <ul className="space-y-3">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex justify-between items-center px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
                  >
                    <span className="text-sm font-medium text-gray-700">{member.name}</span>
                    <Badge variant="secondary" className="text-xs">{member.role}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

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
    </div>
  )
}
