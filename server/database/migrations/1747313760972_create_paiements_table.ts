import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'paiements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
         table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        table
        .integer('cycle_id')
        .unsigned()
        .references('id')
        .inTable('cycles')
        .onDelete('SET NULL')
      table.decimal('amount_per_cycle', 10, 2).notNullable()
      table.string('phone_number').nullable()
      table.string('note').nullable()
      table.string('payment_method').notNullable
      table.enum('status', ['valide', 'en_attente', 'refuse']).defaultTo('en_attente')
      table.integer('validated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('paid_at', { useTz: true }).defaultTo(this.now())
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}