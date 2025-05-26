import Loan from '#models/loan';
import TontineMemberShip from '#models/tontine_member_ship';
import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator';

export default class LoansController {

  async index({ params, auth }: HttpContext) {
  const tontineId = params.tontineId

  // Vérifie que l'utilisateur est membre
  await TontineMemberShip.query()
    .where('tontine_id', tontineId)
    .andWhere('user_id', auth.user!.id)
    .firstOrFail()

  const loans = await Loan.query()
    .where('tontine_id', tontineId)
    .preload('member', (query) => query.preload('user'))

  return loans
    }

   
  async store({request, auth, response, params}: HttpContext) {
    const user = await auth.authenticate()
    const tontineId = params.tontineId

    const loanSchema = schema.create({
    name: schema.string({}, [rules.maxLength(100)]),
    description: schema.string.optional(),
    interest_rate: schema.number.optional([rules.range(0, 100)]),
    amount: schema.number([rules.unsigned()]),
    date_issued: schema.date(),
    date_due: schema.date(),
  });
    // Vérifie si l’utilisateur est membre de la tontine
    const membership = await TontineMemberShip.query()
    .where('tontine_id', tontineId)
    .andWhere('user_id', user.id)
    .firstOrFail()

     try {
        const data = await request.validate({ schema: loanSchema });
    
        // Création de la tontine
        const loans = await Loan.create({
          name: data.name,
          description: data.description ?? undefined,
          memberId: membership.id,
          tontineId: tontineId,
          amount: data.amount,
          interestRate: data.interest_rate ?? 0,
          date_due: data.date_due,
          date_issued: data.date_issued,
          status: 'en_attente'
        });

      return response.created(loans)
    }catch(error){
         return response.badRequest({ error: error.messages || error.message })
    }
  
}
}