import type { HttpContext } from '@adonisjs/core/http'
import Paiement from '#models/paiement'
import Cycle from '#models/cycle'
import { rules, schema  } from '@adonisjs/validator'
import TontineMemberShip from '#models/tontine_member_ship'


export default class PaymentsController {
  /**
   * @swagger
   * /payments:
   *   get:
   *     tags:
   *       - Payments
   *     summary: Liste de tous les paiements d'un utisateur dans ses différents tontine
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Paiements récupérés avec succès
   *       500:
   *         description: Erreur serveur
   */
public async index({ auth, response }: HttpContext) {
  try {
    const user = auth.authenticate()
    if (!user) {
      return response.unauthorized({ message: 'Utilisateur non authentifié' })
    }

    const payments = await Paiement.query()
      .where('user_id', (await user).id)
      .preload('cycle', (cycleQuery) => {
        cycleQuery.preload('tontine') // Si tu veux la tontine aussi
      })

    return response.ok(payments)
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements :', error)
    return response.internalServerError({ message: 'Erreur serveur' })
  }
}
  /**
   * @swagger
   * /tontine/:id/payments:
   *   get:
   *     tags:
   *       - Payments
   *     summary: Liste de tous les paiements des users membre d'une tontine
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Paiements récupérés avec succès
   *       500:
   *         description: Erreur serveur
   */
  public async indexPayment({ params, auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const tontineId = params.tontineId

     if (!user){
      return response.unauthorized ("Vous n'êtes pas Autoriser à poursuivre cetteaction")
     }

    // Vérifier si l'utilisateur est membre de la tontine avec rôle admin ou treasurer
    const membership = await TontineMemberShip
      .query()
      .where('user_id', user.id)
      .andWhere('tontine_id', tontineId)
      .first()

    if (!membership || !['admin', 'treasurer'].includes(membership.role)) {
      return response.unauthorized({ message: 'Accès non autorisé' })
    }
    // Récupérer les paiements liés à la tontine
   const payments = await Paiement
  .query()
  .whereHas('cycle', (cycleQuery) => {
    cycleQuery.where('tontine_id', tontineId)
  })
  .preload('user')
  .preload('cycle')
  .orderBy('created_at', 'desc')


    return payments
      
  }

/**
 * @swagger
 * /paiements/{paymentId}/statut:
 *   patch:
 *     tags:
 *       - Paiements
 *     summary: Mettre à jour le statut d'un paiement
 *     description: Met à jour le statut (`valide` ou `refuse`) d’un paiement, uniquement si l’utilisateur est **admin** ou **trésorier** de la tontine associée.
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         description: Identifiant du paiement à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [valide, refuse]
 *                 example: valide
 *     responses:
 *       '200':
 *         description: Statut du paiement mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Statut du paiement mis à jour avec succès
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     status:
 *                       type: string
 *                       example: "valide"
 *                     cycle:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "c1"
 *                         tontineId:
 *                           type: string
 *                           example: "t1"
 *       '400':
 *         description: Requête invalide (statut incorrect ou données manquantes)
 *       '401':
 *         description: Accès non autorisé — rôle insuffisant ou utilisateur non authentifié
 *       '404':
 *         description: Paiement introuvable
 *       '500':
 *         description: Erreur interne du serveur
 *     security:
 *       - bearerAuth: []
 */

  public async updateStatus({ params, request, auth, response }: HttpContext) {
    const user = await auth.authenticate()

     if (!user){
      return response.unauthorized ("Vous n'êtes pas Autoriser à poursuivre cetteaction")
     }

    const paymentId = params.paymentId
    const { status } = request.only(['status'])

    if (!['valide', 'refuse'].includes(status)) {
      return response.badRequest({ message: 'Statut invalide' })
    }
     console.log('👉 Status reçu:', status)

   // Récupération du paiement et de son cycle (et sa tontine)
    const payment = await Paiement.query()
    .where('id', paymentId)
    .preload('cycle') 
    .first()

    if (!payment) {
      return response.notFound({ message: 'Paiement introuvable' })
    }
    
     const tontineId = payment.cycle.tontineId
     console.log('tontine id', tontineId)

    if (!tontineId) {
    return response.badRequest({ message: 'Tontine ID is required' })
    }

    // Vérification du rôle via la table TontineMemberShip
    const membership = await TontineMemberShip.query()
      .where('user_id', user.id)
      .andWhere('tontine_id', tontineId)
      .first()

    if (!membership || !['admin', 'treasurer'].includes(membership.role)) {
      return response.unauthorized({ message: 'Accès non autorisé' })
    }

    payment.status = status
   // payment.validate_by = user.id  //à décommenter plus tard!
    await payment.save()

    return response.ok({ message: `Statut du paiement mis à jour avec succès`, payment })
  }


  /**
   * @swagger
   * /payments:
   *   post:
   *     tags:
   *       - Payments
   *     summary: Créer un paiement
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - tontine_member_id
   *               - cycle_id
   *               - amount_per_cycle
   *               - payment_method
   *             properties:
   *               tontine_member_id:
   *                 type: integer
   *               cycle_id:
   *                 type: integer
   *               amount_per_cycle:
   *                 type: number
   *               payment_method:
   *                 type: string
   *                 enum: [espèces, virement, mobile_money, autre]
   *               paidAt:
   *                 type: string
   *                 format: date-time
   *               status:
   *                 type: string
   *                 enum: [valide, en_attente, refuse]
   *     responses:
   *       201:
   *         description: Paiement créé
   *       400:
   *         description: Erreur de validation
   */
public async store({ request, response, auth, params }: HttpContext) {
  const user = await auth.authenticate() 
    const cycleId = params.cycleId

  if (!user) {
    return response.unauthorized({ message: 'Utilisateur non authentifié' })
  }
   const cycle = await Cycle.findOrFail(cycleId)

   // Vérifie si l’utilisateur a déjà payé ce cycle
  const existing = await Paiement.query()
    .where('cycle_id', cycle.id)
    .where('user_id', user.id)
    .first()

  if (existing) {
    return response.badRequest({ message: 'Paiement déjà effectué pour ce cycle' })
  }

  const paymentSchema = schema.create({
    amount_per_cycle: schema.number([rules.unsigned()]),
    phone_number: schema.string.optional(),
    note: schema.string.optional(),
    paidAt: schema.date(), 
    payment_method: schema.string(),
    status: schema.enum(['valide', 'en_attente', 'refuse'] as const),
  })

  try {
    const data = await request.validate({ schema: paymentSchema })

    const payment = await Paiement.create({
      userId: user.id, // <-- important !
      cycleId: params.cycleId,
      amount_per_cycle: data.amount_per_cycle,
      phoneNumber: data.phone_number ?? user.phone_number, // <-- à mapper
      note: data.note,
      payment_method: data.payment_method,
      paidAt: data.paidAt ?? new Date(),
      status: data.status ?? 'en_attente',
    })
    await payment.load('user')
   


    return response.created(payment)
  } catch (error) {
    console.error('Erreur création paiement :', error.response.data.message)
    if (error.messages) {
      return response.badRequest({ errors: error.response.data.message })
    }
    return response.internalServerError({ message: 'Erreur serveur' })
  }
}

  /**
   * @swagger
   * /payments/{id}:
   *   get:
   *     tags:
   *       - Payments
   *     summary: Détails d’un paiement
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Paiement trouvé
   *       404:
   *         description: Paiement non trouvé
   */
  public async show({ params, response }: HttpContext) {
    const cycleId = params.cycleId

    if (!cycleId) {
    return response.badRequest({ message: 'Identifiant du cycle manquant' })
    }

    try {
      const payment = await Paiement.query()
        .where('cycle_id', cycleId)
        .preload('user') //infos du user
        .preload('cycle', (cycleQuery) => {
        cycleQuery.preload('tontine')
        }) //infos du cycle tontine
      
    

      if (!payment) return response.notFound({ message: 'Paiement non trouvé' })
      return response.ok(payment)
    } catch (error) {
      console.error('Erreur show paiement :', error)
      return response.internalServerError({ message: 'Erreur serveur' })
    }
  }

  /**
   * @swagger
   * /payments/{id}:
   *   put:
   *     tags:
   *       - Payments
   *     summary: Mettre à jour un paiement
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               amount_per_cycle:
   *                 type: number
   *               payment_method:
   *                 type: string
   *                 enum: [espèces, virement, mobile_money, autre]
   *               paidAt:
   *                 type: string
   *                 format: date-time
   *               status:
   *                 type: string
   *                 enum: [valide, en_attente, refuse]
   *     responses:
   *       200:
   *         description: Paiement mis à jour
   *       400:
   *         description: Données invalides
   *       404:
   *         description: Paiement non trouvé
   */
  public async update({ params, request, response }: HttpContext) {
    const updateSchema = schema.create({
      amount_per_cycle: schema.number.optional(),
      payment_method: schema.enum.optional(['espèces', 'virement', 'mobile_money', 'autre'] as const),
      paidAt: schema.date.optional(),
      status: schema.enum.optional(['valide', 'en_attente', 'refuse'] as const),
    })

    try {
      const payment = await Paiement.find(params.id)
      if (!payment) return response.notFound({ message: 'Paiement non trouvé' })

      const data = await request.validate({ schema: updateSchema })
      payment.merge(data)
      await payment.save()

      return response.ok(payment)
    } catch (error) {
      console.error('Erreur update paiement :', error)
      if (error.messages) return response.badRequest({ errors: error.messages })
      return response.internalServerError({ message: 'Erreur serveur' })
    }
  }

  /**
   * @swagger
   * /payments/{id}:
   *   delete:
   *     tags:
   *       - Payments
   *     summary: Supprimer un paiement
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Paiement supprimé
   *       404:
   *         description: Paiement non trouvé
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const payment = await Paiement.find(params.id)
      if (!payment) return response.notFound({ message: 'Paiement non trouvé' })

      await payment.delete()
      return response.ok({ message: 'Paiement supprimé avec succès' })
    } catch (error) {
      console.error('Erreur suppression paiement :', error)
      return response.internalServerError({ message: 'Erreur serveur' })
    }
  }
  
/**
 * @swagger
 * /paiements/{id}/valider:
 *   post:
 *     tags:
 *       - Paiements
 *     summary: Valider un paiement
 *     description: Valide un paiement si l'utilisateur est **admin** ou **trésorier** de la tontine associée.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant unique du paiement à valider
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Paiement validé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Paiement validé avec succès
 *                 paiement:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     montant:
 *                       type: number
 *                       example: 100.0
 *                     statut:
 *                       type: string
 *                       example: "validé"
 *                     date_validation:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-28T15:30:00Z"
 *       '401':
 *         description: Accès non autorisé — rôle insuffisant pour effectuer cette action
 *       '404':
 *         description: Paiement introuvable
 *       '500':
 *         description: Erreur interne du serveur
 *     security:
 *       - bearerAuth: []
 */

public async valider({ params, auth, response }: HttpContext) {
  const user = auth.authenticate()
  const paiement = await Paiement.findOrFail(params.id)
 

  // Vérifier que l'utilisateur est admin ou trésorier de cette tontine
  const membership = await TontineMemberShip.query()
    .where('tontine_id', paiement.cycle.tontineId)
    .where('user_id', (await user).id)
    .first()

  if (!membership || !['admin', 'treasurer'].includes(membership.role)) {
    return response.unauthorized({ message: "Accès refusé : rôle insuffisant" })
  }

  // Marquer le paiement comme validé
  paiement.status = 'valide'
  paiement.validate_by = (await user).id
  await paiement.save()

  return { message: "Paiement validé avec succès", paiement }
}

}
