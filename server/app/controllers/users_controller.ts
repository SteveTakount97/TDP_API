import type { HttpContext } from '@adonisjs/core/http'
import TontineMemberShip from '#models/tontine_member_ship'
import User from '#models/user'

export default class UsersController {
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Liste de tous les utilisateurs memebre d'une tontine
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs affilié à une tontine
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *             
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
  public async index({ auth,params, response }: HttpContext) {
   try {
    if (!auth.user) {
      return response.unauthorized({ message: 'Non autorisé' })
    }
    const tontineId = params.id

    const membership = await TontineMemberShip
    .query()
    .where('tontineId', tontineId)
    .andWhere('userId', auth.user.id)
    .first()

     // Vérifie si l'utilisateur connecté est membre et admin dans cette tontine
      if (!membership || membership.role !== 'admin') {
        return response.unauthorized({ message: 'Accès réservé aux administrateurs de la tontine.' })
      }
      //si l'utilisateur est administrateur alors on charges tous les membres de la tontine
      const memberships = await TontineMemberShip
        .query()
        .where('tontineId', tontineId)
        .preload('user')
  
      const users = memberships.map(m => m.user)
  
    
    return response.ok(users)
    } catch (error) {
    return response.internalServerError({ message: 'Erreur lors de la récupération des utilisateurs.' })
    }
  }
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer un utilisateur par ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *              
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */
  public async show({ params, auth, response }: HttpContext) {
   try {
    if (!auth.user) {
      return response.unauthorized({ message: 'Non autorisé' })
    }

    const user = await User.findOrFail(params.id)
    return response.ok(user)
    } catch (error) {
    return response.notFound({ message: 'Utilisateur non trouvé.' })
   }
  }

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags:
   *       - Users
   *     summary: Mettre à jour un utilisateur
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               username:
   *                 type: string
   *     responses:
   *       200:
   *         description: Utilisateur mis à jour
   *         content:
   *           application/json:
   *             schema:
   *             
   *       400:
   *         description: Requête invalide
   *       404:
   *         description: Utilisateur non trouvé
   */
  public async update({ request, params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const data = request.only(['email', 'phone_number'])

      user.merge(data)
      await user.save()

      return response.ok(user)
    } catch (error) {
      if (error.name === 'ModelNotFoundException') {
        return response.notFound({ message: 'Utilisateur non trouvé.' })
      }
      return response.badRequest({ message: 'Erreur lors de la mise à jour de l’utilisateur.', error: error.message })
    }
  }

  /**
   * @swagger
   * /users/deactivate:
   *   post:
   *     tags:
   *       - Users
   *     summary: Désactiver le compte utilisateur connecté
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Compte désactivé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 user:
   *                 
   *       401:
   *         description: Non autorisé
   *       500:
   *         description: Erreur serveur
   */
  public async deactivate({ response, auth }: HttpContext) {
    try {
      const currentUser = auth.user
      if (!currentUser) {
        return response.unauthorized({ message: 'Non autorisé.' })
      }

      const user = await User.findOrFail(currentUser.id)
      user.is_active = false
      await user.save()

      return response.ok({
        message: 'Compte désactivé avec succès.',
        user,
      })
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la désactivation du compte.', error: error.message })
    }
  }
}
