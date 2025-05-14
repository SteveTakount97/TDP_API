import type { HttpContext } from '@adonisjs/core/http'
import TontineMemberShip from '#models/tontine_member_ship'
import { schema } from '@adonisjs/validator'
import User from '#models/user'


export default class TontineMembershipsController {
  /**
   * @swagger
   * /api/tontine-memberships/${id}:
   *   get:
   *     tags:
   *       - TontineMemberships
   *     summary: Liste des membres d'une Tontine
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
   * Voir les tontines affiliés
   */
 public async index({ auth, params, response }: HttpContext) {
    const user = auth.authenticate()
    const tontineId = params.id
    
      // Vérification si tontineId est défini
  if (!tontineId) {
    return response.badRequest({ message: "ID de la tontine manquant." })
  }

    try {
      // Vérifie que l'utilisateur est membre de cette tontine
      const membership = await (await user)
        .related('memberships')
        .query()
        .where('tontine_id', tontineId)
        .first()

      if (!membership) {
        return response.unauthorized({ message: "Vous n'avez pas accès à cette tontine." })
      }

      // Récupère tous les membres de la tontine avec leur rôle
      const members = await TontineMemberShip
        .query()
        .where('tontine_id', tontineId)
        .preload('user') // pour avoir le nom du membre

      // Formate la réponse
      const formatted = members.map(m => ({
        name: m.user.full_name,
        role: m.role,
        id: m.id,
        tontine_id: tontineId,
      }))

      return response.ok(formatted)
    } catch (error) {
        console.error('Erreur dans le contrôleur membres:', error)

  return response.status(500).send({
    message: 'Une erreur interne est survenue lors de la récupération des membres.',
    error: error.message,
    name: error.name,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  })
    }
  }

  /**
 * @swagger
 * /tontines/:id/users/seach:
 *   get:
 *     tags:
 *       - TontineMemberships
 *     summary: Rechercher les utilisateurs non affiliés à une tontine
 *     parameters:
 *       - in: query
 *         name: tontineId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tontine
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Mot-clé (nom, prénom ou email)
 *     responses:
 *       200:
 *         description: Liste des utilisateurs disponibles
 *       400:
 *         description: Paramètres manquants
 *       500:
 *         description: Erreur serveur
 */
  public async searchUsers({ request, response }: HttpContext) {
    try {
      const tontineId = request.input('tontineId')
      const query = request.input('query')
  
      if (!tontineId || !query) {
        return response.badRequest({ message: 'Tontine ID et mot-clé requis.' })
      }
  
      const users = await User
        .query()
        .whereNotExists((subQuery:any) => {
          subQuery
            .from('tontine_memberships')
            .whereRaw('tontine_memberships.userId = users.id')
            .andWhere('tontine_memberships.tontineId', tontineId)
        })
        .andWhere((q:any) => {
          q.where('first_name', 'ilike', `%${query}%`)
           .orWhere('last_name', 'ilike', `%${query}%`)
           .orWhere('email', 'ilike', `%${query}%`)
        })
  
      return response.ok(users)
  
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la recherche.' })
    }
  }
  /**
   * @swagger
   * /tontine-memberships/:id:
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
   *               - full_name
   *               - tontine_id
   *               - role
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
    const { user_id, tontine_id, role } = request.only(['user_id', 'tontine_id', 'role'])

  if (!user_id || !tontine_id || !role) {
    return response.badRequest({ message: 'Tous les champs sont requis.' })
  }

  // Vérifie si l'utilisateur est déjà membre
  const existing = await TontineMemberShip
    .query()
    .where('user_id', user_id)
    .andWhere('tontine_id', tontine_id)
    .first()

  if (existing) {
    return response.conflict({ message: 'Cet utilisateur est déjà membre de cette tontine.' })
  }

  try {
    const membership = await TontineMemberShip.create({
      user_id: user_id,
      tontine_id: tontine_id,
      role, 
    })

    return response.created(membership)
  } catch (error) {
    return response.internalServerError({ message: 'Erreur lors de l’ajout du membre.' })
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
      const {role} = await request.validate({ schema: roleSchema })
  
      // Vérification de l'existence du membre
      const membership = await TontineMemberShip.findOrFail(params.id)

      if (!membership){
        return response.notFound({messages: 'Membre non trouvé'})
      }

      membership.role = role
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
   * /tontine-memberships/:id/tontine/${id}:
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
    const { tontineId, memberId } = params

    try {
      const membership = await TontineMemberShip
      .query()
      .where('id', memberId)
      .andWhere('tontine_id', tontineId)
      .first()
      
      if (!membership) {
      return response.notFound({ message: 'Membre non trouvé dans cette tontine' })
     }
      await membership.delete()

      return response.ok({
        message: 'Membre supprimé de la tontine avec succès',
      })
    } catch (error) {
      return response.notFound({
        message: `Aucun membre trouvé avec l'ID : ${params.id}`,
      })
    }
  }
}