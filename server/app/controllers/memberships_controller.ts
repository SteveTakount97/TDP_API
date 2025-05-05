import type { HttpContext } from '@adonisjs/core/http'
import TontineMemberShip from '#models/tontine_member_ship'

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
   *                 $ref: '#/components/schemas/TontineMembership'
   *       500:
   *         description: Erreur serveur
   */
  public async index({ response }: HttpContext) {
    try {
      const memberships = await TontineMemberShip.all()
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
      const data = request.only(['userId', 'tontineId', 'roleId'])
      const membership = await TontineMemberShip.create(data)
      return response.created(membership)
    } catch (error) {
      return response.badRequest({ message: error.message })
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
    try {
      const membership = await TontineMemberShip.findOrFail(params.id)
      membership.merge(request.only(['roleId']))
      await membership.save()
      return response.ok(membership)
    } catch (error) {
      return response.notFound({ message: 'Membre non trouvé' })
    }
  }

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
  public async destroy({ params, response }: HttpContext) {
    try {
      const membership = await TontineMemberShip.findOrFail(params.id)
      await membership.delete()
      return response.ok({ message: 'Membre retiré' })
    } catch (error) {
      return response.notFound({ message: 'Membre non trouvé' })
    }
  }
}
