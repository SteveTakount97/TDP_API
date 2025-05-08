import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tontine_id').unsigned().references('id').inTable('tontines').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.string('action').notNullable()
      table.json('metadata').nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}