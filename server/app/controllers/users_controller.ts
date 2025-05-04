import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  public async index({}: HttpContext) {
    return User.all()
  }

  public async show({ params }: HttpContext) {
    return User.findOrFail(params.id)
  }

  public async update({ request, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    user.merge(request.only(['email', 'username']))
    await user.save()
    return user
  }

  // Pas de destroy ici : on désactive plutôt que supprimer
}
