import { schema } from '@adonisjs/validator'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import SolidarityEvent from '#models/solidarity_event'
import TontineMemberShip from '#models/tontine_member_ship'

export default class SolidarityEventsController {
  public async store({ request, auth, params, response }: HttpContext) {
    try {
      const tontineId = Number(params.tontineId)
      const user = await auth.authenticate()

      // Vérifie que l'utilisateur est bien membre de la tontine
      const membership = await TontineMemberShip.query()
        .where('tontine_id', tontineId)
        .andWhere('user_id', user.id)
        .firstOrFail()

      // Valide les données entrantes
      const payload = await request.validate({
        schema: schema.create({
          title: schema.string(),
          description: schema.string.optional(),
          amount: schema.number(),
          mandat: schema.boolean(),
        }),
      })

      // Crée l'événement solidaire
      const event = await SolidarityEvent.create({
        title: payload.title,
        description: payload.description,
        amount: payload.amount,
        mandat: payload.mandat,
        tontineId,
        memberId: membership.id, //  clé étrangère correcte
        status: 'en_cours',
        date_issued: DateTime.now(), 
      })

      return response.created(event)
    } catch (error) {
      console.error('Erreur lors de la création de l’événement :', error)
      return response.badRequest({ message: 'Impossible de créer l’événement', error })
    }
  }

  public async ongoing ({params, response} : HttpContext) {
    const tontineId = params.tontineId

    try{
      const events = await SolidarityEvent
      .query()
      .where('tontine_id', tontineId)
      
      
      const formatEvents = events.map (event =>({
        ...event.serialize(),
      }))
      return response.ok(formatEvents)

    }catch(error){
      console.log('Erreur lors de la recupération des events en_cours', error)
    }
    
  }
}
