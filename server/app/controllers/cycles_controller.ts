import type { HttpContext } from '@adonisjs/core/http'
import Cycle from '#models/cycle'

export default class CyclesController {
  public async index({}: HttpContext) {
    return Cycle.all()
  }

  public async store({ request }: HttpContext) {
    const data = request.only(['tontineId', 'startDate', 'endDate'])
    return Cycle.create(data)
  }

  public async show({ params }: HttpContext) {
    return Cycle.findOrFail(params.id)
  }
}
