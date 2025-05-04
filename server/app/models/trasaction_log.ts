import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Tontine from './tontine.js'
import User from './user.js'

export default class TrasactionLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare tontineId: number

  @column()
  declare userId: number

  @column()
  declare action: string

  @column()
  declare metadata: any

  //relation tables
  @belongsTo(() => Tontine)
  public tontine!: relations.BelongsTo<typeof Tontine>

  @belongsTo(() => User)
  public user!: relations.BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}