import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import SolidarityEvent from './solidarity_event.js'
import TontineMemberShip from './tontine_member_ship.js'

export default class SolidarityFund extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare eventId: number
  
  @column()
  declare memberId: number

  @column.dateTime()
  declare PaidAt: DateTime

  @column()
  declare amount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //relations
  @belongsTo(() => SolidarityEvent)
  declare event: relations.BelongsTo<typeof SolidarityEvent>

  @belongsTo(() => TontineMemberShip)
  declare member: relations.BelongsTo<typeof TontineMemberShip>
}