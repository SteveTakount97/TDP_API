import type { HttpContext } from '@adonisjs/core/http'

import TrasactionLog from '#models/trasaction_log'

export default class TransactionLogsController {
  public async index({}: HttpContext) {
    return TrasactionLog.all()
  }

  public async show({ params }: HttpContext) {
    return TrasactionLog.findOrFail(params.id)
  }
}
