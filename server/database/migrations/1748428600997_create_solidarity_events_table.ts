import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'solidarity_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('tontine_id')
        .unsigned()
        .references('id')
        .inTable('tontines')
        .onDelete('CASCADE')
      table
        .integer('member_id')
        .unsigned()
        .references('id')
        .inTable('tontine_member_ships')
        .onDelete('CASCADE')
      table.string('title')
      table.text('description').nullable()
      table.float('amount').notNullable()
      table.boolean('mandat').defaultTo(false)
      table.enum('status', ['en_cours', 'termine', 'annule']).defaultTo('en_cours')
      table.timestamp('date_issued', { useTz: true }).defaultTo(this.now())
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}