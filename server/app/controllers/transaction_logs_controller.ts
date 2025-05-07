import type { HttpContext } from '@adonisjs/core/http'
import TrasactionLog from '#models/trasaction_log'

export default class TransactionLogsController {
  /**
   * @swagger
   * /transaction-logs:
   *   get:
   *     tags:
   *       - TransactionLogs
   *     summary: Liste des logs de transaction
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste des logs récupérée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TransactionLog'
   *       401:
   *         description: Non autorisé
   *       500:
   *         description: Erreur interne du serveur
   */
  public async index({ response }: HttpContext) {
    try {
      const logs = await TrasactionLog.all()
      return response.ok(logs)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * @swagger
   * /transaction-logs/{id}:
   *   get:
   *     tags:
   *       - TransactionLogs
   *     summary: Détails d'un log de transaction
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
   *         description: Log trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TransactionLog'
   *       404:
   *         description: Log non trouvé
   *       401:
   *         description: Non autorisé
   */
  public async show({ params, response }: HttpContext) {
    try {
      const log = await TrasactionLog.findOrFail(params.id)
      return response.ok(log)
    } catch (error) {
      return response.notFound({ message: 'Log non trouvé' })
    }
  }
}
