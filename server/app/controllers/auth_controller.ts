import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/AuthService'

export default class AuthController {
  /**
   * @swagger
   * /register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Inscription d'un utilisateur
   *     description: Permet de s'inscrire depuis le site web
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - full_name
   *               - username
   *               - role
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *               full_name:
   *                 type: string
   *               username:
   *                 type: string
   *               role:
   *                 type: string
   *     responses:
   *       201:
   *         description: Utilisateur créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Erreur de validation ou autre
   */
  public async register({ request, response }: HttpContext): Promise<void> {
    try {
      const user = await AuthService.registerUser(request.only(['email', 'password', 'fullName', 'phone_number', 'role']))
      return response.created({ user })
    } catch (e) {
      return response.badRequest({ message: e.message })
    }
  }

  /**
   * @swagger
   * /login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Connexion d'un utilisateur
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Connexion réussie
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Identifiants invalides
   */
  public async login({ request, response }: HttpContext): Promise<void> {
    const { email, password } = request.only(['email', 'password'])

    try {
      const { user, token } = await AuthService.authenticateUser({ email, password })
      // Authentification réussie, on génère une session
     
      return response.ok({ token, user }) // Réponse 200
      
    } catch (error) {
      console.error('Login error:', error.message)
      return response.unauthorized({ message: 'Invalid credentials' }) //Réponse 401
    }
  }

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Déconnexion d'un utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non autorisé - utilisateur non authentifié
 *       500:
 *         description: Erreur serveur
 */
  public async logout({ auth, response }: HttpContext): Promise<void> {
    try {
      const message = await AuthService.logoutUser(auth)
      return response.ok({ message })
    } catch (e) {
      return response.internalServerError({ message: e.message })
    }
  }
}
