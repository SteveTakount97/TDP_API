import { HttpContext } from "@adonisjs/core/http"
import TontineMemberShip from "#models/tontine_member_ship"

export default class AdminMiddleware {
  public async handle({ auth, params, response }: HttpContext, next: () => Promise<void>) {
    const user = await auth.authenticate()
    const tontineId = params.tontineId // ici on récupère correctement l'id de la tontine depuis le body de la requête
     
    if (!user) {
        return response.unauthorized('You must be logged in to access this resource')
      }
    //on part du user authentifier
    const membership = await TontineMemberShip
    .query()
    .where('userId', user!.id)
    .andWhere('tontineId', tontineId)
    .first()

    if (!membership || membership.role !== 'admin') {
      return response.unauthorized({ message: 'Access reserved for administrators of this tontine.' })
    }

    await next()
  }
}
