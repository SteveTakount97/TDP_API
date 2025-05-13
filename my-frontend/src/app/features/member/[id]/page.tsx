'use client'

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, PlusCircle } from "lucide-react"
import api from "@/lib/axios"
import BackLink from "@/component/flechback"
import { useParams } from "next/navigation"


type User = {
  id: number
  fullName: string
  role: string
}

type Member = {
  id: number
  name: string
  role: string
  tontineId: number
}

export default function TontineTabs() {
  const [members, setMembers] = useState<Member[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [role, setRole] = useState('member')
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const params = useParams()
  const tontineId = params?.id
  console.log('idtontone', tontineId)

  // Récupérer les membres de la tontine
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get(`/tontine-memberships/${tontineId}`)
        setMembers(data)
      } catch (error: any) {
        console.error("Erreur lors du chargement des membres :", error.message)
      }
    }
    if (tontineId) fetchMembers()
  }, [tontineId])

  // Récupère les utilisateurs uniquement si la modale est ouverte
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users')
        console.log('user info', data)
        setUsers(data)
      } catch (error: any) {
        console.error("Erreur lors de la récupération des utilisateurs :", error.message)
      }
    }
    if (isOpen) fetchUsers()
  }, [isOpen])

// Filtrage local des utilisateurs
useEffect(() => {

  setFilteredUsers(
    users.filter((u: any) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase())
    )
  )
}, [search, users])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) {

      alert("Veuillez sélectionner un utilisateur dans la liste.");
      return
    }
    try {
      await api.post(`/tontine-memberships/${tontineId}`, {
        user_id: selectedUser?.id,
        tontine_id: tontineId,
        role,
      })
      alert('Membre ajouté avec succès')
      setIsOpen(false)
    } catch (err: any) {
      console.error(err)
      alert("Erreur lors de l'ajout du membre")
    }
  }
  //fonction pour sélectionné un user
 const handleSelectUser = (user: any) => {
  setSelectedUser(user) // stocke l'utilisateur sélectionné
  setSearch(user.fullName) // affiche son nom dans le champ
  setFilteredUsers([]) // vide la liste déroulante après sélection
}
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <header className="mb-8 text-center shadow-md">
        <BackLink />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des membres</h1>
        <p className="text-gray-600 text-sm">
          Retrouvez ici la liste des membres liés à cette tontine, avec leur rôle respectif.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-black bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm shadow-sm transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 bg-green-600" />
          Ajouter Un Membre
        </button>
      </header>

      {/* MODALE */}
      {isOpen && (
        <div className="fixed inset-0 bg-purple-600 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Ajouter un membre</h2>
          
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Nom utilisateur</label>
                <input
                  type="text"
                  placeholder="Rechercher par nom"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                {filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-500 mt-2">Aucun utilisateur trouvé.</p>
                ): (
                  <ul className="border rounded-md max-h-40 overflow-auto mb-2">
                    {filteredUsers.map((user) => (
                      <li
                        key={user.id}
                        className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}`}
                        onClick={() => handleSelectUser(user)}
                      >
                        {user.fullName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Rôle</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="member">Membre</option>
                  <option value="admin">Administrateur</option>
                  <option value="treasurer">Trésorier</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTE DES MEMBRES */}
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
