import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'solidarity_funds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('event_id')
        .unsigned()
        .references('id')
        .inTable('solidarity_events')
        .onDelete('CASCADE')
      table
        .integer('member_id')
        .unsigned()
        .references('id')
        .inTable('tontine_member_ships')
        .onDelete('CASCADE')
      table.float('amount').notNullable()
      table.timestamp('paid_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}