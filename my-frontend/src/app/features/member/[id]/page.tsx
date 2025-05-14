'use client'

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, PlusCircle, Edit, Trash } from "lucide-react"
import api from "@/lib/axios"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"



type User = {
  id: number
  fullName: string
  role: string
}

type Member = {
  id: number
  name: string
  role: string
  tontine_id: number
}

export default function TontineTabs() {
  const [members, setMembers] = useState<Member[]>([])
  const [users, setUsers] = useState<User[]>([])

  //state pour stocker les données users
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [role, setRole] = useState('member')
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  //state pour modifier le role d'un membre dans une tontine
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [newRole, setNewRole] = useState<string>('member')

  //state pour la suppression
  const [deleteingMember, setdeletingMember] = useState<Member | null>(null)
  const router = useRouter()
  const params = useParams()
  const tontineId = params?.id
 
  console.log('tontineId', tontineId)

  // Récupérer les membres de la tontine
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get(`/tontine-memberships/${tontineId}`)
        setMembers(data)
        console.log('members', data)
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
    const memberId = selectedUser?.id
    if (!selectedUser) {

      alert("Veuillez sélectionner un utilisateur dans la liste.");
      return
    }

    try {
      await api.post(`/tontine-memberships/${memberId}/tontine/${tontineId}`, {
        user_id: selectedUser?.id,
        tontine_id: tontineId,
        role,
      })
      alert('Membre ajouté avec succès')
      router.push('/features/tontine')
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
   //fonction pour edit le role d'un membre
  const handleEditRole = (member: any) => {
  setEditingMember(member)
  setNewRole(member.role)
   }
  const handleDelete = (member: any) =>{
    setdeletingMember(member)
  }
  //fonction pour modifier un role
  const handleUpdateRole = async () => {
    const tontineMembershipId = editingMember?.id
    if (!tontineMembershipId){
      alert("aucun id selectionné")
    }
    try {
      await api.put(`/tontine-memberships/${tontineMembershipId}/tontine/${tontineId}`,{
        role: newRole,
    })
    alert('Role du membre mis à jour')
    setEditingMember(null)
  } catch(error:any){
    console.log("erreur lors de la mise à jour", error.message)
    alert("Erreur lors de la mis à jour du role")
  }
  }
  //fonction pour supprimer un membre de la tontine 
  const handleDeleteMember = async (member: any) => {
    const memberId = deleteingMember?.id
    if (!memberId){
      alert("aucun id selectionné")
    }
    try{
      await api.delete(`/tontine-memberships/${memberId}/tontine/${tontineId}`)
      
      alert('membre supprimé avec succès')
      setMembers (prevMembers => prevMembers.filter(m => m.id !== memberId))
      setdeletingMember(null)
    } catch(error){
      console.error ("erreur lors de la suppréssion", error)
      alert("Une erreur est survenue lors de la suppression")
    }
  }
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <header className="mb-8 text-center shadow-md w-full pb-2 ">
         <Link
        href="/features/tontine"
        className="flex items-center text-black hover:underline shadow-2xl w-20 rounded-2xl"
         >
      <ArrowLeft className="w-5 h-5 mr-1" />
      Retour
          </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des membres</h1>
        <p className="text-gray-600 text-sm mb-2">
          Retrouvez ici la liste des membres liés à cette tontine, avec leur rôle respectif.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="m-auto flex items-center gap-2 text-white font-bold bg-green-400 hover:text-xl px-4 py-2 rounded-lg text-sm shadow-2xl transition cursor-pointer border-green-300"
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
                      <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                        <span className="text-base font-medium text-gray-700 hover:text-2xl cursor-pointer">{member.name}</span>
                        <Badge variant="secondary" className="text-xs capitalize text-green-600">
                          {member.role}
                        </Badge>
                      </div>
                      <button  onClick={() => handleEditRole(member)} className="flex items-center gap-2 text-sm text-gray-600 hover:underline cursor-pointer mr-1">
                        <Edit className="h-5 w-5 text-gray-800" />
                        Rôle
                        </button>
                        <button  onClick={() => handleDelete(member)} className="flex items-center gap-2 text-sm text-gray-600 hover:underline cursor-pointer">
                        <Trash className="h-5 w-5 text-red-500" />
                        Supprimer
                        </button>
                      </li>
                      
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
         {/**modale edit role */}
  {editingMember && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Modifier le rôle de 
      </h2>
       <h3 className="text-black font-bold text-xl">{editingMember.name}</h3>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-600">Nouveau rôle</label>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="admin">Administrateur</option>
          <option value="treasurer">Trésorier</option>
          <option value="member">Membre</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setEditingMember(null)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm cursor-pointer"
        >
          Annuler
        </button>
        <button
          onClick={handleUpdateRole}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm cursor-pointer"
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
)}
{deleteingMember && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Voulez-vous vraiement supprimer ce membre? 
      </h2>
      <span className="text-black font-bold text-xl">{deleteingMember.name}</span>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setdeletingMember(null)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm cursor-pointer"
        >
          Annuler
        </button>
        <button
          onClick={handleDeleteMember}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm cursor-pointer shadow-2xl font-bold"
        >
         Supprimer
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  )}