import type { HttpContext } from '@adonisjs/core/http'
import Tontine from '#models/tontine'

export default class TontinesController {
  public async index({}: HttpContext) {
    return Tontine.all()
  }

  public async store({ request }: HttpContext) {
    const data = request.only(['name', 'description', 'startDate'])
    return Tontine.create(data)
  }

  public async show({ params }: HttpContext) {
    return Tontine.findOrFail(params.id)
  }

  public async update({ request, params }: HttpContext) {
    const tontine = await Tontine.findOrFail(params.id)
    tontine.merge(request.only(['name', 'description']))
    await tontine.save()
    return tontine
  }

  public async destroy({ params }: HttpContext) {
    const tontine = await Tontine.findOrFail(params.id)
    await tontine.delete()
    return { message: 'Tontine supprimée' }
  }
}
