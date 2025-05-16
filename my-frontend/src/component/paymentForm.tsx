// app/payments/components/payment-form.tsx

'use client'


import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'


type User = {
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string;
};

// ou ton propre contexte utilisateur
import { useRouter } from 'next/navigation'
 const [user, setUser] = useState<User | null>(null);

const paymentSchema = z.object({
  amount: z.number({ invalid_type_error: 'Le montant est requis' }).min(1, 'Le montant doit être supérieur à 0'),
  note: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

export function PaymentForm({
  cycleId,
  tontineMemberId,
}: {
  cycleId: string
  tontineMemberId: string
}) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      note: '',
    },
  })

  const router = useRouter()

  const onSubmit = async (values: PaymentFormValues) => {
    const payload = {
      ...values,
      cycle_id: cycleId,
      tontine_member_id: tontineMemberId,
    }

    try {
      const response = await api.post('/payments/cycleId')

      if (!response) throw new Error('Erreur lors de l’envoi du paiement.')

      form.reset()
      router.refresh() // ou redirect vers la page de paiement
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Utilisateur connecté :</p>
          <div className="border rounded p-2 bg-muted">
            <p><strong>Nom :</strong> {user?.fullName}</p>
            <p><strong>Email :</strong> {user?.email}</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={(field: any ) => (
            <FormItem>
              <FormLabel>Montant à verser</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ex: 2000"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={(field :any) => (
            <FormItem>
              <FormLabel>Note (facultatif)</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: Paiement de mai" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Envoyer le paiement</Button>
      </form>
    </Form>
  )
}
