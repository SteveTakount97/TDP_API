import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tontine_member_ships'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('tontine_id').unsigned().references('id').inTable('tontines').onDelete('CASCADE')
      table.enum('role', ['member', 'admin', 'treasurer']).notNullable()
      table.boolean('is_active').defaultTo(true)
      table.unique(['user_id', 'tontine_id'])
      table.timestamp('joined_at', { useTz: true }).defaultTo(this.now())
      table.integer('position')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}