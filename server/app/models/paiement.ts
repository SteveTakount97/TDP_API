import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Cycle from './cycle.js'
import User from './user.js'

export default class Paiement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare userId: number

  @column()
  declare cycleId: number

  @column()
  declare amount_per_cycle: number

   @column()
  public phoneNumber?: string

  @column()
  public note?: string

  @column.dateTime()
  declare paidAt: DateTime

  @column()
  declare validate_by: number

  @column()
  declare payment_method: string

  @column()
  declare status: 'valide' | 'en_attente' | 'refuse'

  //relations tables
  @belongsTo(() => User)
  public user!: relations.BelongsTo<typeof User>

  @belongsTo(() => Cycle)
  public cycle!: relations.BelongsTo<typeof Cycle>

  @belongsTo(() => User, { foreignKey: 'validatedBy' })
  public validatedByUser!: relations.BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}