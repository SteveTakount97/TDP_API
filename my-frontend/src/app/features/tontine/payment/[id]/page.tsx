'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/axios'
import { useParams } from 'next/navigation'
import Header from '@/component/header'
import { toast } from 'sonner' // ou 'react-toastify'

type Payment = {
  id: number
  amountPerCycle: number
  status: 'en_attente' | 'valide' | 'refuse'
  user: {
    id: number
    fullName: string
  }
  cycle: {
    id: number
    paymentMethod: string
    status: string
  }
  createdAt: string
}

type Props = {
  tontineId?: number
  currentUserRole: 'admin' | 'treasurer' | 'member'
}

export default function PaymentsTable({ currentUserRole }: Props) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const tontineId = params?.id

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/tontine/${tontineId}/payments`)
      setPayments(res.data)
      console.log('data', res.data)
    } catch (error: any) {
      console.error('Erreur lors de la récupération des paiements :', error)
      toast.error(
        error?.response?.data?.message ??
        "Impossible de récupérer les paiements."
      )
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (
    paymentId: number,
    newStatus: 'valide' | 'refuse'
  ) => {
    try {
      await api.put(`/payments/${paymentId}/status`, { status: newStatus })
      toast.success(`Paiement ${newStatus === 'valide' ? 'validé' : 'rejeté'} avec succès.`)
      fetchPayments()
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut.")
    }
  }

  useEffect(() => {
    if (tontineId) fetchPayments()
  }, [tontineId])

  return (
    <>
      <Header />
      <div className="px-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">Paiements des membres</h2>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Chargement des paiements...</div>
        ) : (
          <div className="overflow-x-auto min-h-screen">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-xl">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="px-4 py-3">Membre</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Méthode</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t text-sm">
                    <td className="px-4 py-3">{payment.user.fullName}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      {new Intl.NumberFormat('fr-FR').format(payment.amountPerCycle)} FCFA
                    </td>
                    <td className="px-4 py-3 capitalize text-blue-600">{payment.cycle.paymentMethod}</td>
                    <td className="px-4 py-3">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 capitalize text-blue-600">{payment.status}</td>
                    <td className="px-4 py-3">
                
                       { payment.status === 'en_attente' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updatePaymentStatus(payment.id, 'valide')}
                              className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              <CheckCircle className="w-4 h-4" /> Valider
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(payment.id, 'refuse')}
                              className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              <XCircle className="w-4 h-4" /> Rejeter
                            </button>
                          </div>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
