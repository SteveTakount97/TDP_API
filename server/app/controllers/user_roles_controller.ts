import type { HttpContext } from '@adonisjs/core/http'
import TontineMemberShip from '#models/tontine_member_ship'
import { schema, rules } from '@adonis/Core/Validator'


export default class UserRolesController {
  //Voir tous les rôles d'un utilisateur dans ses tontines
  public async index({ request }: HttpContext) {
    const userId = request.input('user_id') // optionnel : filtrer par utilisateur
    const query = TontineMemberShip.query().preload('role').preload('tontine').preload('user')

    if (userId) {
      query.where('user_id', userId)
    }

    return await query
  }

  //Voir le rôle d’un utilisateur dans une tontine
  public async show({ params }: HttpContext) {
    const membership = await TontineMemberShip
      .query()
      .where('user_id', params.userId)
      .where('tontine_id', params.tontineId)
      .preload('role')
      .firstOrFail()

    return membership
  }

  // Assigner un rôle à un utilisateur dans une tontine
  public async store({ request }: HttpContext) {
    const data = await request.validate({
      schema: TontineMemberShip.schema.create({
        user_id: schema.number(),
        tontine_id: schema.number(),
        role_id: schema.number([rules.exists({ table: 'roles', column: 'id' })])
      })
    })

    const existing = await TontineMemberShip
      .query()
      .where('user_id', data.user_id)
      .where('tontine_id', data.tontine_id)
      .first()

    if (existing) {
      throw new Error('Cet utilisateur est déjà membre de la tontine.')
    }

    return await TontineMemberShip.create(data)
  }

  // Modifier le rôle d’un utilisateur dans une tontine
  public async update({ params, request }: HttpContext) {
    const newRoleId = request.input('role_id')

    const membership = await TontineMemberShip
      .query()
      .where('user_id', params.userId)
      .where('tontine_id', params.tontineId)
      .firstOrFail()

    membership.roleId = newRoleId
    await membership.save()

    return membership
  }

  // Supprimer un rôle = retirer l’utilisateur de la tontine
  public async destroy({ params }: HttpContext) {
    const membership = await TontineMemberShip
      .query()
      .where('user_id', params.userId)
      .where('tontine_id', params.tontineId)
      .firstOrFail()

    await membership.delete()
    return { message: 'Utilisateur retiré de la tontine' }
  }
}
