import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tontines'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('created_by').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.enum('type', ['rotative', 'solidaire']).defaultTo('rotative')
      table.enum('frequence', ['hebdomadaire', 'mensuelle', 'trimestrielle']).notNullable()
      table.float('amountPerCycle').notNullable()
      table.date('start_date').notNullable()
      table.enum('status', ['actif', 'termine', 'en_attente']).defaultTo('en_attente')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}