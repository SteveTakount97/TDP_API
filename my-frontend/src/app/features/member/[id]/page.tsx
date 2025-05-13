'use client'

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, RotateCw, PlusCircle } from "lucide-react"
import api from "@/lib/axios"
import BackLink from "@/component/flechback"
import { useParams } from "next/navigation"
import Link from "next/link"

type Member = {
  id: number
  name: string
  role: string
  tontineId: number
}

export default function TontineTabs() {
  const [members, setMembers] = useState<Member[]>([])
   const params = useParams()
  const tontineId = params?.id

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
      <header className="mb-8 text-center shadow-md ">
        <BackLink />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des membres</h1>
        <p className="text-gray-600 text-sm">
          Retrouvez ici la liste des membres liés à cette tontine, avec leur rôle respectif.
        </p>
        <Link href="/features/member" className="flex items-center gap-2 text-black bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm shadow-sm transition">
            <PlusCircle className="w-4 h-4 bg-green-600" />
            Ajouter Un Membre
          </Link>
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