'use client'

import { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import api from '@/lib/axios'
import Link from 'next/link'
import Features from '@/component/fonctionnalite'


interface Payment {
  user: { fullName: string 
    phone_number: string
  }
  cycle: any
  id: number
  cycle_id: number
  user_id: number
  amountPerCycle: number
  paidAt: string
  payment_method: string
  status: 'valide' | 'en_attente' | 'refuse'
    tontine: { id: number
    name: string
    amoutPerCycle: number }
}

interface CreatePaymentDto {
  amount_per_cycle: number
  payment_method: string
  paidAt: string
  note?: string
  phone_number?: string
  status?: 'en_attente' 
}

export default function PaymentsPage() {
  const params = useParams()
  const cycleId = params.id
  const [payments, setPayments] = useState<Payment[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(true)

  const [creating, setCreating] = useState(false)

  const [form, setForm] = useState<CreatePaymentDto>({
    amount_per_cycle: 0,
    paidAt: new Date().toISOString().split('T')[0],
    payment_method: 'espèces',
    note: '',
    status: 'en_attente'
  })

  const fetchPayments = async () => {
    try {
      const response = await api.get(`/payments/cycle/${cycleId}`)
      const data = Array.isArray(response.data) ? response.data : response.data.data || []
      console.log('data reçu', data)
      setPayments(data)
    } catch (err) {
      console.error('Erreur de chargement:', err)
      setError('Erreur de chargement des paiements')
    } finally {
      setLoading(false)
    }
  }
  

  useEffect(() => {
    if (cycleId) fetchPayments()
  }, [cycleId])
 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
     
    if (form.amount_per_cycle < (payments[0]?.cycle?.tontine?.amountPerCycle || 0)) {
    alert("Le montant est inférieur au montant attendu pour ce cycle.")
    setCreating(false)
   return
     }
     if (form.phone_number !== (payments[0]?.user.phone_number)){
      alert("Numéro de téléphone saisi ne correspond pas à celui préenrégistré")
      setCreating(false)
      return
     }

    try {
      await api.post(`/payments/${cycleId}`, form)
      setForm({
        amount_per_cycle: 0,
        paidAt: new Date().toISOString().split('T')[0],
        payment_method: '',
        note: '',
        phone_number: '',
        status: 'en_attente'
      })
    } catch (err) {
      console.error('Erreur création paiement', err)
    } finally {
      setCreating(false)
    }
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

  return (
<>
   {/* Header */}
      <header className="bg-black text-white shadow-md border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Effectuer un Paiement</h1>
          <Link href="/features/payment/${id}" className="flex items-center gap-2 bg-primary border px-4 py-2 rounded-lg text-sm shadow-sm transition">
            <PlusCircle className="w-4 h-4 bg-green-600 text-purple-800" />
            Effectuer un Paiement
          </Link>
        </div>
      </header>
<div className="p-6 min-h-screen space-y-10 bg-gray-50">


  {/* Formulaire d’ajout */}
  <section className="bg-white p-8 rounded-2xl shadow-lg ring-1 ring-slate-200 max-w-4xl mx-auto">
    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Ajouter un paiement</h2>
    <p>Montant à verser :{payments[0]?.cycle?.tontine?.amountPerCycle}</p>
    <form
      onSubmit={handleCreate}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div>
        <Label htmlFor="amount_per_cycle" className="mb-1 block text-sm font-medium text-slate-700">
          Montant
        </Label>
        <Input
          name="amount_per_cycle"
          value={form.amount_per_cycle}
          onChange={handleChange}
          type="number"
          required
          className="rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <Label htmlFor="paidAt" className="mb-1 block text-sm font-medium text-slate-700">
          Date de paiement
        </Label>
        <Input
          name="paidAt"
          value={form.paidAt}
          onChange={handleChange}
          type="date"
          required
          className="rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <Label className="mb-1 block text-sm font-medium text-slate-700">Méthode de paiement</Label>
        <Select
          defaultValue={form.payment_method}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, payment_method: value }))
          }
        >
          <SelectTrigger className="rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Méthode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="espèces">Espèces</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
            <SelectItem value="virement">Virement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1 block text-sm font-medium text-slate-700">Statut</Label>
        <Select
          defaultValue={form.status}
          onValueChange={(value) =>
            setForm((prev) => ({
              ...prev,
              status: value as CreatePaymentDto['status'],
            }))
          }
        >
          <SelectTrigger className="rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en_attente">En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="note" className="mb-1 block text-sm font-medium text-slate-700">
          Note *(facultatif)
        </Label>
        <Input
          name="note"
          value={form.note}
          onChange={handleChange}
          className="rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="phone_number" className="mb-1 block text-sm font-medium text-slate-700">
          Téléphone
        </Label>
        <Input
          name="phone_number"
          value={form.phone_number || ''}
          onChange={handleChange}
          className="rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <Button
          type="submit"
          disabled={creating}
          className="rounded-xl px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? 'Création...' : 'Créer le paiement'}
        </Button>
      </div>
    </form>
  </section>
  <Features />

</div>
</>
  )
}
