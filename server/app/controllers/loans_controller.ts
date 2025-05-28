import Loan from '#models/loan';
import TontineMemberShip from '#models/tontine_member_ship';
import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator';

export default class LoansController {
/**
 * @swagger
 * /tontines/{tontineId}/loans:
 *   get:
 *     tags:
 *       - Prêts
 *     summary: Lister les prêts d'une tontine
 *     description: Récupère la liste des prêts associés à une tontine, si l’utilisateur est membre de cette tontine.
 *     parameters:
 *       - in: path
 *         name: tontineId
 *         required: true
 *         description: Identifiant de la tontine
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Liste des prêts retournée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "loan123"
 *                   name:
 *                     type: string
 *                     example: "Prêt de rentrée"
 *                   amount:
 *                     type: number
 *                     example: 500.0
 *                   interestRate:
 *                     type: number
 *                     example: 5.0
 *                   date_issued:
 *                     type: string
 *                     format: date
 *                     example: "2025-09-01"
 *                   date_due:
 *                     type: string
 *                     format: date
 *                     example: "2025-12-01"
 *                   status:
 *                     type: string
 *                     example: "en_attente"
 *                   member:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "member789"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "user456"
 *                           name:
 *                             type: string
 *                             example: "Jean Dupont"
 *       '404':
 *         description: Tontine non trouvée ou utilisateur non membre
 *       '401':
 *         description: Utilisateur non authentifié
 *       '500':
 *         description: Erreur interne du serveur
 *     security:
 *       - bearerAuth: []
 */

  async index({ params, auth }: HttpContext) {
  const tontineId = params.tontineId

  // Vérifie que l'utilisateur est membre
  await TontineMemberShip.query()
    .where('tontine_id', tontineId)
    .andWhere('user_id', auth.user!.id)
    .firstOrFail()

  const loans = await Loan.query()
    .where('tontine_id', tontineId)
    .preload('member', (query) => query.preload('user'))

  return loans
    }
/**
 * @swagger
 * /tontines/{tontineId}/loans:
 *   post:
 *     tags:
 *       - Prêts
 *     summary: Créer un nouveau prêt dans une tontine
 *     description: Crée un prêt pour un membre authentifié d'une tontine.
 *     parameters:
 *       - in: path
 *         name: tontineId
 *         required: true
 *         description: Identifiant de la tontine
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *               - date_issued
 *               - date_due
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: Achat de matériel scolaire
 *               description:
 *                 type: string
 *                 example: Prêt sans garantie
 *               interest_rate:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 5
 *               amount:
 *                 type: number
 *                 example: 300
 *               date_issued:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               date_due:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-01"
 *     responses:
 *       '201':
 *         description: Prêt créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "loan456"
 *                 name:
 *                   type: string
 *                   example: Achat de matériel scolaire
 *                 amount:
 *                   type: number
 *                   example: 300
 *                 interestRate:
 *                   type: number
 *                   example: 5
 *                 date_issued:
 *                   type: string
 *                   format: date
 *                   example: "2025-09-01"
 *                 date_due:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-01"
 *                 status:
 *                   type: string
 *                   example: en_attente
 *       '400':
 *         description: Données invalides
 *       '401':
 *         description: Utilisateur non authentifié
 *       '404':
 *         description: Utilisateur non membre de la tontine
 *       '500':
 *         description: Erreur interne du serveur
 *     security:
 *       - bearerAuth: []
 */   
  async store({request, auth, response, params}: HttpContext) {
    const user = await auth.authenticate()
    const tontineId = params.tontineId

    const loanSchema = schema.create({
    name: schema.string({}, [rules.maxLength(100)]),
    description: schema.string.optional(),
    interest_rate: schema.number.optional([rules.range(0, 100)]),
    amount: schema.number([rules.unsigned()]),
    date_issued: schema.date(),
    date_due: schema.date(),
  });
    // Vérifie si l’utilisateur est membre de la tontine
    const membership = await TontineMemberShip.query()
    .where('tontine_id', tontineId)
    .andWhere('user_id', user.id)
    .firstOrFail()

     try {
        const data = await request.validate({ schema: loanSchema });
    
        // Création de la tontine
        const loans = await Loan.create({
          name: data.name,
          description: data.description ?? undefined,
          memberId: membership.id,
          tontineId: tontineId,
          amount: data.amount,
          interestRate: data.interest_rate ?? 0,
          date_due: data.date_due,
          date_issued: data.date_issued,
          status: 'en_attente'
        });

      return response.created(loans)
    }catch(error){
         return response.badRequest({ error: error.messages || error.message })
    }
  
}
}