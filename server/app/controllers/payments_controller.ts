import type { HttpContext } from '@adonisjs/core/http'
import Paiement from '#models/paiement'

export default class PaymentsController {
  /**
   * @swagger
   * /payments:
   *   get:
   *     tags:
   *       - Payments
   *     summary: Liste de tous les paiements
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Paiements récupérés avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                
   *       500:
   *         description: Erreur serveur
   */
  public async index({ response }: HttpContext) {
    try {
      const paiements = await Paiement.all()
      return response.ok(paiements)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
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
   *               - userId
   *               - cycleId
   *               - amount
   *               - paymentDate
   *             properties:
   *               userId:
   *                 type: integer
   *               cycleId:
   *                 type: integer
   *               amount:
   *                 type: number
   *               paymentDate:
   *                 type: string
   *                 format: date
   *     responses:
   *       201:
   *         description: Paiement créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               
   *       400:
   *         description: Erreur de validation ou données manquantes
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['userId', 'cycleId', 'amount', 'paymentDate'])
      const paiement = await Paiement.create(data)
      return response.created(paiement)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * @swagger
   * /payments/{id}:
   *   get:
   *     tags:
   *       - Payments
   *     summary: Obtenir les détails d’un paiement
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Paiement trouvé
   *         content:
   *           application/json:
   *             schema:
   *              
   *       404:
   *         description: Paiement non trouvé
   */
  public async show({ params, response }: HttpContext) {
    try {
      const paiement = await Paiement.findOrFail(params.id)
      return response.ok(paiement)
    } catch (error) {
      return response.notFound({ message: 'Paiement non trouvé' })
    }
  }
}
