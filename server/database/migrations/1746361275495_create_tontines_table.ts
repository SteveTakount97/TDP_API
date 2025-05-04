import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tontines'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.enum('type', ['rotative', 'solidaire', 'autre']).defaultTo('rotative')
      table.float('amount_per_cycle').notNullable()
      table.date('start_date').notNullable()
      table.enum('status', ['actif', 'termine', 'en_attente']).defaultTo('en_attente')
      table.timestamps(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}