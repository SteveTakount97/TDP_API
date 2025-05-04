import type { HttpContext } from '@adonisjs/core/http'
import Paiement from '#models/paiement'

export default class PaymentsController {
  public async index({}: HttpContext) {
    return Paiement.all()
  }

  public async store({ request }: HttpContext) {
    const data = request.only(['userId', 'cycleId', 'amount', 'paymentDate'])
    return Paiement.create(data)
  }

  public async show({ params }: HttpContext) {
    return Paiement.findOrFail(params.id)
  }
}
