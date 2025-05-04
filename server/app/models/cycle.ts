import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Tontine from './tontine.js'
import Paiement from './paiement.js'
import User from './user.js'

export default class Cycle extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare tontineId: number

  @column()
  declare number: number

  @column()
  declare startDate: string

  @column()
  declare endDate: string

  @column()
  declare beneficiaryId: number | null

  @column()
  declare status: 'ouvert' | 'ferme' | 'annule'

  @belongsTo(() => Tontine)
  public tontine!: relations.BelongsTo<typeof Tontine>

  @belongsTo(() => User, {
    foreignKey: 'beneficiaryId',
  })
  public beneficiary!: relations.BelongsTo<typeof User>

  @hasMany(() => Paiement)
  public payments!: relations.HasMany<typeof Paiement>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}