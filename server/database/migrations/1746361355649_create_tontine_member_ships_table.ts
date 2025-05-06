import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tontine_member_ships'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('tontineId').unsigned().references('id').inTable('tontines').onDelete('CASCADE')
      table.integer('role').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table.boolean('is_active').defaultTo(true)
      table.unique(['userId', 'tontineId'])
      table.timestamp('joined_at', { useTz: true }).defaultTo(this.now())
      table.integer('position')
      table.timestamps(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}