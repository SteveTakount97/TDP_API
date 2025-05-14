import { HttpContext } from "@adonisjs/core/http"
import TontineMemberShip from "#models/tontine_member_ship"

export default class AdminMiddleware {
  public async handle({ auth, response, request }: HttpContext, next: () => Promise<void>) {
    const user = await auth.authenticate()
  
   // ici on récupère correctement l'id de la tontine depuis le body de la requête
   const tontineId = request.param('tontineId') || request.param('id') || request.body().tontine_id
  
    if (!user) {
        return response.unauthorized('You must be logged in to access this resource')
      }
 
      if (!tontineId) {
    return response.badRequest({ message: 'Tontine ID is required' })
     }
    //on part du user authentifier
    const membership = await TontineMemberShip
    .query()
    .where('user_id', user.id)
    .andWhere('tontine_id', tontineId)
    .first()

    
    if (!membership) {
    return response.unauthorized({ message: 'You are not a member of this tontine' })
    }
    
    if (!membership || membership.role !== 'admin') {
      return response.unauthorized({ message: 'Access reserved for administrators of this tontine.' })
    }

    await next()
  }
}
