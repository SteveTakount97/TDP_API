import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Cycle from './cycle.js'
import Tontine from './tontine.js'

export default class Paiement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare userId: number

  @column()
  declare tontineId: number

  @column()
  declare cycleId: number

  @column()
  declare amount: number

  @column.dateTime()
  declare paidAt: DateTime

  @column()
  declare paymentMethod: string

  @column()
  declare status: 'valide' | 'en_attente' | 'refuse'

  //relations tables
  @belongsTo(() => User)
  public user!: relations.BelongsTo<typeof User>

  @belongsTo(() => Tontine)
  public tontine!: relations.BelongsTo<typeof Tontine>

  @belongsTo(() => Cycle)
  public cycle!: relations.BelongsTo<typeof Cycle>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}