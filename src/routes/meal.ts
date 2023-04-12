import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const meals = await knex('meals').select('*')

    return { meals }
  })

  app.get('/:id', async (request, reply) => {
    const getMealParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamSchema.parse(request.params)

    const meal = await knex('meals').where({ id }).first('*')

    return { meal }
  })

  // app.get('/:id/metrics', async (request, reply) => {

  // })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    })

    const { name, description, isDiet } = createMealBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_diet: isDiet,
      create_at: new Date().toString(),
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    })

    const getMealParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamSchema.parse(request.params)

    const { name, description, isDiet } = updateMealBodySchema.parse(
      request.body,
    )

    await knex('meals').where({ id }).update({
      name,
      description,
      is_diet: isDiet,
    })
  })

  app.delete('/:id', async (request, reply) => {
    const getMealParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamSchema.parse(request.params)

    await knex('meals').where({ id }).delete()
  })
}
