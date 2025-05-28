import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Tontine from './tontine.js'
import TontineMemberShip from './tontine_member_ship.js'
import SolidarityFund from './solidarity_fund.js'

export default class SolidarityEvent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tontineId: number

  @column()
  declare memberId: number

  @column()
  declare title: string

  @column()
  declare amount: number

  @column()
  declare description: string

  @column.dateTime()
  declare date_issued: DateTime

  @column()
  declare mandat: boolean

  @column()
  declare status: 'en_cours'| 'termine' |'annule'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //relations tables
  @belongsTo(()=> Tontine)
  public tontine!: relations.BelongsTo<typeof Tontine>

  @belongsTo(()=> TontineMemberShip)
  declare member: relations.BelongsTo<typeof TontineMemberShip>

  @hasMany(() => SolidarityFund)
  declare contribution: relations.HasMany<typeof SolidarityFund>
}