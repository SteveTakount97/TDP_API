import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import UserRole from './user_role.js'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => UserRole)
  public userRoles!: relations.HasMany<typeof UserRole>
}