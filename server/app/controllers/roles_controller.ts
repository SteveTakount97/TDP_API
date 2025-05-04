import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'

export default class RolesController {
  public async index({}: HttpContext) {
    return Role.all()
  }

  public async show({ params }: HttpContext) {
    return Role.findOrFail(params.id)
  }
}
