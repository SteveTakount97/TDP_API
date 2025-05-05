import { HttpContext } from "@adonisjs/core/http"

export default class AdminMiddleware {
  public async handle({ auth, params, response }: HttpContext, next: () => Promise<void>) {
    const user = await auth.authenticate()
    const tontineId = params.tontineId // ici on récupère correctement l'id de la tontine depuis le body de la requête
     
    if (!user) {
        return response.unauthorized('You must be logged in to access this resource')
      }

    const membership = await user
      .related('memberships')
      .query()
      .where('tontine_id', tontineId)
      .preload('role')
      .first()

    if (!membership || membership.role.name !== 'admin') {
      return response.unauthorized({ message: 'Access denied: Admins only' })
    }

    await next()
  }
}
