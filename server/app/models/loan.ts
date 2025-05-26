import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Tontine from './tontine.js'
import TontineMemberShip from './tontine_member_ship.js'


export default class Loan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tontineId: number
  
  @column()
  declare memberId: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare amount: number
  
  @column()
  declare interestRate: number

  @column()
  declare status: 'en_attente'| 'accept' | 'refuse'| 'rembourse'
  
  @column.dateTime()
  declare date_issued: DateTime

  @column.dateTime()
  declare date_due: DateTime
    
  @column.dateTime()
  declare date_repaid: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Relations
  
 @belongsTo(() => Tontine)
 public tontine!: relations.BelongsTo<typeof Tontine>

 @belongsTo(() => TontineMemberShip)
 public member!: relations.BelongsTo<typeof TontineMemberShip>

}