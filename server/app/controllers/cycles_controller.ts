import type { HttpContext } from '@adonisjs/core/http'
import Cycle from '#models/cycle'

export default class CyclesController {
  /**
   * @swagger
   * /api/Cycle-tontine:
   *   get:
   *     tags:
   *       - Cycles
   *     summary: Récupérer tous les cycles
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste des cycles
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Cycle'
   *       401:
   *         description: Non autorisé
   */
  public async index({ response }: HttpContext) {
    try {
      const cycles = await Cycle.query().preload('tontine')
      return response.ok(cycles)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * @swagger
   * /cycles:
   *   post:
   *     tags:
   *       - Cycles
   *     summary: Créer un nouveau cycle
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - tontineId
   *               - startDate
   *               - endDate
   *             properties:
   *               tontineId:
   *                 type: integer
   *               startDate:
   *                 type: string
   *                 format: date
   *               endDate:
   *                 type: string
   *                 format: date
   *     responses:
   *       201:
   *         description: Cycle créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cycle'
   *       400:
   *         description: Erreur de validation
   *       401:
   *         description: Non autorisé
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['tontineId', 'startDate', 'endDate'])
      const cycle = await Cycle.create(data)
      return response.created(cycle)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * @swagger
   * /api/Cycle-tontine/{id}:
   *   get:
   *     tags:
   *       - Cycles
   *     summary: Voir un cycle spécifique
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
   *         description: Détails du cycle
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cycle'
   *       404:
   *         description: Cycle non trouvé
   *       401:
   *         description: Non autorisé
   */
  public async show({ params, response }: HttpContext) {
    try {
     const cycle = await Cycle.query()
      .where('id', params.id)
      .preload('tontine')
      .firstOrFail()
      return response.ok(cycle)
    } catch (error) {
      return response.notFound({ message: 'Cycle non trouvé' })
    }
  }
}
