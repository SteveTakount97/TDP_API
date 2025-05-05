import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import TontineMemberShip from '#models/tontine_member_ship'
import { schema } from '@adonisjs/validator'

export default class RolesController {
  /**
   * @swagger
   * /roles:
   *   get:
   *     tags:
   *       - Roles
   *     summary: Lister tous les rôles
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste des rôles récupérée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Role'
   *       500:
   *         description: Erreur serveur
   */
  /**public async index({ response }: HttpContext) {
    try {
      const roles = await Role.all()
      return response.ok(roles)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }
  **/
  /**
   * @swagger
   * /roles/{id}:
   *   get:
   *     tags:
   *       - Roles
   *     summary: Obtenir un rôle spécifique
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
   *         description: Rôle trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   *       404:
   *         description: Rôle non trouvé
   */
  /*public async show({ params, response }: HttpContext) {
    try {
      const role = await Role.findOrFail(params.id)
      return response.ok(role)
    } catch (error) {
      return response.notFound({ message: 'Rôle non trouvé' })
    }
  }*/
 /**
   * @swagger
   * /memberships:
   *   get:
   *     summary: Voir tous les rôles d’un utilisateur
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: user_id
   *         schema:
   *           type: integer
   *         description: Filtrer par ID utilisateur
   *     responses:
   *       200:
   *         description: Liste des rôles
   *       401:
   *         description: Non autorisé
   *       500:
   *         description: Erreur serveur
   */
  public async index({ request, response }: HttpContext) {
    //Voir tous les rôles d'un utilisateur dans ses tontines
    try {
      const userId = request.input('user_id')
      const query = TontineMemberShip.query().preload('role').preload('tontine').preload('user')

      if (userId) {
        query.where('user_id', userId)
      }

      const result = await query
      return response.ok(result)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * @swagger
   * /memberships-role/{userId}/{tontineId}:
   *   get:
   *     summary: Voir le rôle d’un utilisateur dans une tontine
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: integer
   *       - in: path
   *         name: tontineId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Détails du rôle
   *       401:
   *         description: Non autorisé
   *       404:
   *         description: Non trouvé
   *       500:
   *         description: Erreur serveur
   */
  public async show({ params, response }: HttpContext) {
    //Voir le rôle d’un utilisateur dans une tontine
    try {
      const membership = await TontineMemberShip
        .query()
        .where('user_id', params.userId)
        .where('tontine_id', params.tontineId)
        .preload('role')
        .firstOrFail()

      return response.ok(membership)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * @swagger
   * /memberships:
   *   post:
   *     summary: Assigner un rôle à un utilisateur dans une tontine
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               user_id:
   *                 type: integer
   *               tontine_id:
   *                 type: integer
   *               role_id:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Rôle assigné
   *       400:
   *         description: Données invalides ou membre existant
   *       401:
   *         description: Non autorisé
   *       500:
   *         description: Erreur serveur
   */
  public async store({ request, response }: HttpContext) {
    // Assigner un rôle à un utilisateur dans une tontine
    try {
      const data = await request.validate({
        schema: TontineMemberShip.schema.create({
          user_id: schema.number(),
          tontine_id: schema.number(),
          role_id: schema.number(),
        })
      })

      const role = await Role.find(data.role_id)
      if (!role) {
        return response.badRequest({ message: 'Rôle invalide' })
      }

      const existing = await TontineMemberShip
        .query()
        .where('user_id', data.user_id)
        .where('tontine_id', data.tontine_id)
        .first()

      if (existing) {
        return response.badRequest({ message: 'Cet utilisateur est déjà membre de la tontine.' })
      }

      const membership = await TontineMemberShip.create(data)
      return response.created(membership)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * @swagger
   * /membership/{userId}/{tontineId}:
   *   delete:
   *     summary: Retirer un utilisateur de la tontine
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: integer
   *       - in: path
   *         name: tontineId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Utilisateur retiré
   *       401:
   *         description: Non autorisé
   *       404:
   *         description: Membre non trouvé
   *       500:
   *         description: Erreur serveur
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const membership = await TontineMemberShip
        .query()
        .where('user_id', params.userId)
        .where('tontine_id', params.tontineId)
        .firstOrFail()

      await membership.delete()
      return response.ok({ message: 'Utilisateur retiré de la tontine' })
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }
}
