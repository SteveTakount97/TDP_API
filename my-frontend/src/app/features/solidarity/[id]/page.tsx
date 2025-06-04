'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/axios'
import { useParams } from 'next/navigation'

type SolidarityEvent = {
  id: number
  title: string
  description?: string
  amount: number
  mandat: string
  status: 'en_cours' | 'termine' | 'annule'
  dateIssued: string
}

type Props = {
  tontineId: number
}

export default function SolidarityEvents({}: Props) {
  const [events, setEvents] = useState<SolidarityEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()
  const tontineId = params.id

  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    mandat: false,
  })

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await api.get(`/solidarity-events/${tontineId}/ongoing`)
      setEvents(response.data)
      console.log('data', response.data)
    } catch (error) {
      console.error("Erreur lors du chargement des événements en cours :", error)
    } finally {
      setLoading(false)
    }
  }

  fetchEvents()
}, [tontineId])

const handleCreate = async () => {
  try {
    setIsLoading(true)

    await api.post(`/solidarity-events/${tontineId}`, {
      tontineId,
      ...form,
      amountTarget: parseFloat(form.amount)
    })

    setForm({ title: '', description: '', amount: '', mandat: false })
   
  } catch (error) {
    console.error('Erreur lors de la création de l’événement :', error)
    //toast.error("Une erreur est survenue lors de la création de l'événement")
  } finally {
    setIsLoading(false)
  }
}



  const grouped = {
    en_cours: events.filter(e => e.status === 'en_cours'),
    termine: events.filter(e => e.status === 'termine'),
    annule: events.filter(e => e.status === 'annule'),
  }
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    setLoading(true)
    try {
      await handleCreate()
    } finally {
      setLoading(false)
    }
  }
   return (
    <div className="space-y-10 min-h-screen">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            🎗️ Créer un événement solidaire
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Ex : Soutien à Marie"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor="amount">Montant ciblé (€)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Ex : 500"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Ex : Pour aider suite à l'accident..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

       <div className="flex items-center justify-between">
        <Label htmlFor="mandat" className="text-sm">
           L'événement est-il obligatoire pour les membres ?
         </Label>
        <div className="flex items-center space-x-2">
             <Switch
             id="mandat"
             checked={form.mandat}
             onCheckedChange={val => setForm({ ...form, mandat: val })}
             />
           <span className="text-sm text-muted-foreground">
              {form.mandat ? 'Oui' : 'Non'}
           </span>
         </div>
         </div>

          <div className="pt-4">
            <Button
              onClick={onSubmit}
              className="w-full md:w-auto cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Création en cours...' : '➕ Créer l\'événement'}
            </Button>
          </div>
        </CardContent>
      </Card>


    {/* Liste des événements */}
    <Tabs defaultValue="en_cours" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="en_cours">En cours</TabsTrigger>
        <TabsTrigger value="termine">Terminés</TabsTrigger>
        <TabsTrigger value="annule">Annulés</TabsTrigger>
      </TabsList>

      <TabsContent value="en_cours">
        <EventList events={grouped.en_cours} />
      </TabsContent>
      <TabsContent value="termine">
        <EventList events={grouped.termine} />
      </TabsContent>
      <TabsContent value="annule">
        <EventList events={grouped.annule} />
      </TabsContent>
    </Tabs>

  </div>

)
}

function EventList({ events }: { events: SolidarityEvent[] }) {
  if (events.length === 0)
    return <p className="text-sm text-muted-foreground italic">Aucun événement à afficher.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <Card
          key={event.id}
          className="hover:shadow-md transition-shadow border border-gray-100"
        >
          <CardHeader>
            <CardTitle className="text-base font-semibold">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {event.description}
            </p>
            <p className="text-sm">
              🎯 Objectif : <strong>   {new Intl.NumberFormat('fr-FR').format(event.amount)} FCFA</strong>
            </p>
            <p className="text-xs text-gray-500">
              Contribution {event.mandat ? 'obligatoire' : 'volontaire'}
            </p>
            <p className="text-xs text-gray-400">
              📅 Lancé le {new Date(event.dateIssued).toLocaleDateString()}
              
              
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
