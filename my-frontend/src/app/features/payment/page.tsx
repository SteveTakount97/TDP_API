'use client'
import React, { useEffect, useState } from 'react'
import api from '@/lib/axios'
import Header from '@/component/header'
import Features from '@/component/fonctionnalite'

type Payment = {
  id: number
  paidAt: string
  amountPerCycle: number
  paymentMethod: string
  status: 'en_attente' | 'valide' | 'rejeté'
  note?: string
  cycle: {
    id: number 
    tontine:{
      id: number
      amountPerCycle: number
      name: string
    }
  }

}

const statusColors: Record<Payment['status'], string> = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  valide: 'bg-green-100 text-green-800',
  rejeté: 'bg-red-100 text-red-800',
}



export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = async () => {
    try {
      const response = await api.get(`/payments`)
      const data = Array.isArray(response.data) ? response.data : response.data.data || []
      setPayments(data)
      console.log('data paiment', data)
    } catch (err) {
      console.error('Erreur de chargement:', err)
      setError('Erreur de chargement des paiements.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Historique des paiements</h2>

          {loading && (
            <p className="text-blue-500 text-center font-medium animate-pulse">
              Chargement des paiements...
            </p>
          )}

          {error && (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          )}

          {!loading && !error && payments.length === 0 && (
            <div className="text-center text-gray-400 italic">
              Aucun paiement enregistré.
            </div>
          )}

          {!loading && !error && payments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Montant Versé</th>
                    <th className="px-4 py-3 text-left">Méthode</th>
                    <th className="px-4 py-3 text-left">Montant attendu</th>
                    <th className="px-4 py-3 text-left">Nom Tontine</th>
                    <th className="px-4 py-3 text-left">Statut</th>
                    <th className="px-4 py-3 text-left">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-bold">{new Date(payment.paidAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium text-green-500">{new Intl.NumberFormat('fr-FR').format(payment.amountPerCycle)} FCFA</td>
                      <td className="px-4 py-3 capitalize">{payment.paymentMethod}</td>
                      <td className="px-4 py-3 font-medium text-red-600">
                       {new Intl.NumberFormat('fr-FR').format(payment?.cycle?.tontine?.amountPerCycle || 0)} FCFA
                      </td>
                      <td className="px-4 py-3 capitalize">{payment?.cycle?.tontine?.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[payment.status]}`}
                        >
                          {payment.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">{payment.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
       <Features/>
    </>
  )
}
