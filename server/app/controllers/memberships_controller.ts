import type { HttpContext } from '@adonisjs/core/http'

import TontineMemberShip from '#models/tontine_member_ship'

export default class TontineMembershipsController {
  public async index({}: HttpContext) {
    return TontineMemberShip.all()
  }

  public async store({ request }: HttpContext) {
    const data = request.only(['userId', 'tontineId', 'roleId'])
    return TontineMemberShip.create(data)
  }

  public async update({ request, params }: HttpContext) {
    const membership = await TontineMemberShip.findOrFail(params.id)
    membership.merge(request.only(['roleId']))
    await membership.save()
    return membership
  }

  public async destroy({ params }: HttpContext) {
    const membership = await TontineMemberShip.findOrFail(params.id)
    await membership.delete()
    return { message: 'Membre retiré' }
  }
}
