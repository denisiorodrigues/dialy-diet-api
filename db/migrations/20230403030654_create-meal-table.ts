import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name')
    table.text('description')
    table.timestamp('create_at')
    table.boolean('is_diet')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
