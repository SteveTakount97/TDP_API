import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'

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
  public async index({ response }: HttpContext) {
    try {
      const roles = await Role.all()
      return response.ok(roles)
    } catch (error) {
      return response.internalServerError({ message: error.message })
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
   *               $ref: '#/components/schemas/Role'
   *       404:
   *         description: Rôle non trouvé
   */
  public async show({ params, response }: HttpContext) {
    try {
      const role = await Role.findOrFail(params.id)
      return response.ok(role)
    } catch (error) {
      return response.notFound({ message: 'Rôle non trouvé' })
    }
  }
}
