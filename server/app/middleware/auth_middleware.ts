import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'


export default class AuthMiddleware {
  redirectTo = '/auth/login'

  public async handle(
    ctx: HttpContext,
    next: NextFn,
    
  ) {
    try {
     
      
      // Extraire le token du header Authorization
      const authorizationHeader = ctx.request.header('Authorization')
      if (!authorizationHeader) {
        console.error('❌ Aucun token trouvé dans le header')
        return ctx.response.unauthorized({ message: 'Token manquant' })
      }
      
      console.log('🔎 Token reçu dans le header:', authorizationHeader)

      // Valider le token avec 'api'
      await ctx.auth.use('api').authenticate()
      ctx.auth.user
      await next()
    } catch (error) {
      console.error('Authentification échouée :', error.message)

      // Gérer des erreurs spécifiques
      if (error.code === 'E_UNAUTHORIZED_ACCESS') {
        return ctx.response.unauthorized({ message: 'Token invalide ou expiré' })
      }

      // En cas d'autres erreurs
      return ctx.response.internalServerError({ message: 'Erreur serveur', error: error.message })
    }
  }
}
