'use client'
import api from '@/lib/axios'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'


export default function LoanForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    amount: '',
    interest_rate: '',
    date_due: '',
    date_issued: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const params = useParams()
  const tontineId = params?.id

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await api.post(`/loans/${tontineId}`, {
        ...form,
        amount: parseFloat(form.amount),
        interest_rate: form.interest_rate ? parseFloat(form.interest_rate) : undefined,
        date_due: form.date_due,
        date_issued: form.date_issued,
      })
      setSuccess(true)
      setForm({
        name: '',
        description: '',
        amount: '',
        interest_rate: '',
        date_due: '',
        date_issued: '',
      })
    } catch (err: any) {
      console.log('erreur', err)
      setError(err.response?.data?.message || 'Erreur lors de la demande de prêt.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
     <Link href="/acceuil" className="flex items-center hover:underline absolute top-4 left-4 ">
       <ArrowLeft className="w-5 h-5 mr-1 text-black" />
       Retour
     </Link>
    <main className='min-h-screen'>
    <form onSubmit={handleSubmit}   className="space-y-6 bg-white text-black shadow-xl p-8 rounded-2xl max-w-xl mx-auto mt-8 cursor-pointer mb-7">
      <h2 className="text-xl font-bold">Demande de prêt</h2>

      <div>
        <label className="block font-medium">Objet de la demande</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Montant (FCFA)</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Taux d’intérêt (%)</label>
        <input
          type="number"
          step="0.1"
          name="interest_rate"
          value={form.interest_rate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Date d'émission</label>
        <input
          type="date"
          name="date_issued"
          value={form.date_issued}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Date limite de remboursement</label>
        <input
          type="date"
          name="date_due"
          value={form.date_due}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Envoi...' : 'Soumettre la demande'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">Demande envoyée avec succès !</p>}
    </form>
    </main>
    </>
  )
}
