'use client'

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, RotateCw } from "lucide-react"
import api from "@/lib/axios"
import BackLink from "@/component/flechback"

type Member = {
  id: number
  name: string
  role: string
  tontineId: number
}

export default function TontineTabs({ tontineId }: { tontineId: number }) {
  const [members, setMembers] = useState<Member[]>([])
  

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const member = await api.get(`/tontine-memberships/${tontineId}`)
        console.log('tontine id', tontineId)
        const data = await member.data
        setMembers(data)
      } catch (error:any) {
        console.error("Erreur lors du chargement des membres :", error.message)
      }
    }

    fetchMembers()
  }, [tontineId])

   return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <header className="mb-8 text-center">
        <BackLink />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des membres</h1>
        <p className="text-gray-600 text-sm">
          Retrouvez ici la liste des membres liés à cette tontine, avec leur rôle respectif.
        </p>
      </header>

      <section>
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="mb-6 gap-4">
            <TabsTrigger value="members" className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-2xl">
              <Users className="h-4 w-4" />
              Membres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card className="rounded-xl border shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-5 text-gray-800">Liste des membres</h3>

                {members.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun membre pour cette tontine.</p>
                ) : (
                  <ul className="space-y-3">
                    {members.map((member) => (
                      <li
                        key={member.id}
                        className="flex justify-between items-center px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                      >
                        <span className="text-base font-medium text-gray-700">{member.name}</span>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {member.role}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}