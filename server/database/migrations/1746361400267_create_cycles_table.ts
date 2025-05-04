import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cycles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tontine_id').unsigned().references('id').inTable('tontines').onDelete('CASCADE')
      table.integer('number').notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.integer('beneficiary_id').unsigned().references('id').inTable('users').nullable()
      table.enum('status', ['ouvert', 'ferme', 'annule']).defaultTo('ouvert')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}