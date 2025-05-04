import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/AuthService'


export default class AuthController {
  /**
   * @description Permet de s'inscrire depuis le site web 
   * @returns user
   */
  public async register({ request, response }: HttpContext): Promise<void> {
    try {
      const user = await AuthService.registerUser(request.only(['email', 'password', 'full_name', 'username', 'role']))
      return response.created({ user })
    } catch (e) {
      return response.badRequest({ message: e.message })
    }
  }

  /**
   * @returns access_tokens
   */
  public async login({ request, response}: HttpContext): Promise<void> {
    try {
      const { email, password } = request.only(['email', 'password'])
      const { user, token } = await AuthService.authenticateUser(email, password)
      return response.ok({ token, user })
    } catch (e) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }

  /**
   * @description Permet de se déconnecter
   * @returns message
   */
  public async logout({ auth, response}: HttpContext): Promise<void> {
    try {
      const message = await AuthService.logoutUser(auth)
      
      return response.ok({ message })
    } catch (e) {
    
      return response.internalServerError({ message: e.message })
    }
  }
}