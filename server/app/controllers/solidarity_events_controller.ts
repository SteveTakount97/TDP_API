import type { HttpContext } from '@adonisjs/core/http'
import TontineMemberShip from '#models/tontine_member_ship'
import SolidarityEvent from '#models/solidarity_event'
import { schema } from '@adonisjs/validator'

export default class SolidarityEventsController {
     async store({ request, auth, params, response }: HttpContext) {
    const tontineId = params.tontineId
    const user = await auth.authenticate()

    await TontineMemberShip.query()
      .where('tontine_id', tontineId)
      .andWhere('user_id', user.id)
      .firstOrFail()

    const payload = await request.validate({
      schema: schema.create({
        title: schema.string(),
        description: schema.string.optional(),
        amount: schema.number(),
        mandat: schema.boolean(),
        dateIssued: schema.date()
      }),
    })

    const event = await SolidarityEvent.create({
      ...payload,
      tontineId,
      memberId: user.id,
      status: 'en_cours',
    })

    return response.created(event)
  }
}