import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Tontine from './tontine.js'
import Loan from './loan.js'


export default class TontineMemberShip extends BaseModel {
  
  @column({ isPrimary: true })
  declare id: number
  
  @column({ columnName: 'user_id' })
  declare user_id: number

  @column({ columnName: 'tontine_id' })
  declare tontine_id: number

  @column()
  declare role: 'member' | 'admin' | 'treasurer'

  @column()
  declare isActive: boolean

  @column.dateTime()
  declare joinedAt: DateTime

  @column()
  declare position: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //relations tables 
 @belongsTo(() => User, {
  foreignKey: 'user_id', //clé étrangère
  })
 public user!: relations.BelongsTo<typeof User>
 
 @hasMany(() => Loan, {
  foreignKey: 'memberId',
 })
  public loans!: relations.HasMany<typeof Loan>

 
  @belongsTo(() => Tontine, {
  foreignKey: 'tontine_id', 
  })
  public tontine!: relations.BelongsTo<typeof Tontine>

  static schema: any
  roleId: any
  
  public static table = 'tontine_member_ships'
}