import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Cycle from './cycle.js'
import TontineMemberShip from './tontine_member_ship.js'
import Paiement from './paiement.js'


export default class Tontine extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare name: string
  
  @column()
  declare description: string

  @column()
  declare type: 'rotative' | 'solidaire' | 'autre'

  @column()
  declare amountPerCycle: number

  @column()
  declare startDate: string

  @column()
  declare status: 'actif' | 'termine' | 'en_attente'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //relations tables
  @hasMany(() => Cycle)
  public cycles!: relations.HasMany<typeof Cycle>

  @hasMany(() => TontineMemberShip)
  public memberships!: relations.HasMany<typeof TontineMemberShip>

  @hasMany(() => Paiement)
  public payments!: relations.HasMany<typeof Paiement>

}