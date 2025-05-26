import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'loans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('member_id').unsigned().references('id').inTable('tontine_member_ships').onDelete('CASCADE')
      table.integer('tontine_id').unsigned().references('id').inTable('tontines').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.float('amount').notNullable()
      table.decimal('interest_rate', 5, 2).defaultTo(0)
      table.enum('status', ['en_attente', 'accept', 'refuse', 'rembourse']).defaultTo('en_attente')
      table.dateTime('date_issued').notNullable()
      table.dateTime('date_due').notNullable()
      table.dateTime('date_repaid').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}