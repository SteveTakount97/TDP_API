import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'paiements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('tontine_id').unsigned().references('id').inTable('tontines').onDelete('CASCADE')
      table.integer('cycle_id').unsigned().references('id').inTable('cycles').onDelete('CASCADE')
      table.float('amount').notNullable()
      table.timestamp('paid_at', { useTz: true }).notNullable()
      table.string('payment_method').nullable()
      table.enum('status', ['valide', 'en_attente', 'refuse']).defaultTo('en_attente')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}