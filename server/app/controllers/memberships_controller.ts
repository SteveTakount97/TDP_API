import type { HttpContext } from '@adonisjs/core/http'
import TontineMemberShip from '#models/tontine_member_ship'
import { schema } from '@adonisjs/validator'

export default class TontineMembershipsController {
  /**
   * @swagger
   * /tontine-memberships:
   *   get:
   *     tags:
   *       - TontineMemberships
   *     summary: Liste des adhésions aux tontines
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste récupérée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 
   *       500:
   *         description: Erreur serveur
   */
  /**
   * Voir tous les rôles d’un utilisateur dans ses tontines
   */
  public async index({ request, response }: HttpContext) {
    try {
      const userId = request.input('user_id')
      const query = TontineMemberShip.query()
        .preload('tontine')
        .preload('user')

      if (userId) {
        query.where('user_id', userId)
      }

      const memberships = await query
      return response.ok(memberships)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }
  /**
   * @swagger
   * /tontine-memberships:
   *   post:
   *     tags:
   *       - TontineMemberships
   *     summary: Ajouter un membre à une tontine
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
   *               - tontineId
   *               - roleId
   *             properties:
   *               userId:
   *                 type: integer
   *               tontineId:
   *                 type: integer
   *               roleId:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Membre ajouté avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TontineMembership'
   *       400:
   *         description: Données invalides
   */
  public async store({ request, response }: HttpContext) {
    try {
      const newMembershipSchema = schema.create({
        user_id: schema.number(),
        tontine_id: schema.number(),
        role: schema.enum(['admin', 'member', 'treasurer'] as const), // ajustable selon tes rôles
      })

      const data = await request.validate({ schema: newMembershipSchema })

      const existing = await TontineMemberShip
        .query()
        .where('userId', data.user_id)
        .where('tontineId', data.tontine_id)
        .first()

      if (existing) {
        return response.badRequest({ message: 'Cet utilisateur est déjà membre de cette tontine.' })
      }

      const membership = await TontineMemberShip.create(data)
      return response.created(membership)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * @swagger
   * /tontine-memberships/{id}:
   *   put:
   *     tags:
   *       - TontineMemberships
   *     summary: Modifier le rôle d'un membre
   *     security:
   *       - bearerAuth: []
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
   *             required:
   *               - roleId
   *             properties:
   *               roleId:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Rôle mis à jour avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TontineMembership'
   *       404:
   *         description: Membre non trouvé
   */
  public async update({ request, params, response }: HttpContext) {
    // 1. Validation du champ "role"
    const roleSchema = schema.create({
      role: schema.enum(['admin', 'member', 'treasurer'] as const),
    })
  
    try {
      const payload = await request.validate({ schema: roleSchema })
  
      // Vérification de l'existence du membre
      const membership = await TontineMemberShip.findOrFail(params.id)
  
      // Mise à jour du rôle
      membership.role = payload.role
      await membership.save()
  
      // Retour d'une réponse propre
      return response.ok({
        message: 'Rôle mis à jour avec succès',
        data: membership,
      })
    } catch (error) {
      // Gestion des erreurs de validation
      if (error.messages) {
        return response.badRequest({ errors: error.messages })
      }
  
      // Si le membre n'existe pas
      return response.notFound({ message: 'Membre non trouvé' })
    }
  }
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
   *            
   *       404:
   *         description: Rôle non trouvé
   */
  /**
   * Voir le rôle d’un utilisateur dans une tontine
   */
  public async show({ params, response }: HttpContext) {
    try {
      const membership = await TontineMemberShip
        .query()
        .where('user_id', params.userId)
        .where('tontine_id', params.tontineId)
        .preload('tontine')
        .preload('user')
        .firstOrFail()

      return response.ok(membership)
    } catch (error) {
      return response.notFound({ message: 'Membre non trouvé dans cette tontine.' })
    }
  }
 /**
  /**
   * @swagger
   * /tontine-memberships/{id}:
   *   delete:
   *     tags:
   *       - TontineMemberships
   *     summary: Supprimer un membre d'une tontine
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
   *         description: Membre retiré
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       404:
   *         description: Membre non trouvé
   */
 /**
   * Retirer un utilisateur d’une tontine
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
