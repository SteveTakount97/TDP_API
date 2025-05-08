import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasManyThrough } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import TontineMemberShip from './tontine_member_ship.js'
import Paiement from './paiement.js'
import Tontine from './tontine.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare full_name: string 

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phone_number: string

  @column()
  declare profile_image_url: string

  @column()
  declare is_verify: boolean

  @column()
  declare is_active: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
  
  //relations 
  @hasMany(() => TontineMemberShip)
  public memberships!: relations.HasMany<typeof TontineMemberShip> //Un utilisateur peut appartenir à plusieurs tontines

  @hasMany(() => Paiement)
  public payments!: relations.HasMany<typeof Paiement>

  @hasManyThrough([() => Tontine, () => TontineMemberShip])
  public tontines!: relations.HasManyThrough<typeof Tontine>


  static accessTokens = DbAccessTokensProvider.forModel(User)
}