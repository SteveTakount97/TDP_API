import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tontine from './tontine.js'
import Role from './role.js'

export default class TontineMemberShip extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare userId: number

  @column()
  declare tontineId: number

  @column()
  declare isActive: boolean

  @column.dateTime()
  declare joinedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //relations tables 
  @belongsTo(() => User)
  public user!: relations.BelongsTo<typeof User>

  @belongsTo(() => Tontine)
  public tontine!: relations.BelongsTo<typeof Tontine>

  @belongsTo(() => Role)
  public role!: relations.BelongsTo<typeof Role>

  static schema: any
  roleId: any
}