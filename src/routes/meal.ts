import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const sessionId = request.cookies.session_id

      const meals = await knex('meals')
        .where({ session_id: sessionId })
        .select('*')

      return { meals }
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamSchema.parse(request.params)
      const sessionId = request.cookies.session_id
      const meal = await knex('meals')
        .where({ id, session_id: sessionId })
        .first('*')

      return { meal }
    },
  )

  app.get('/metrics', async (request, reply) => {
    const count = 0 // knex('meals').count('id').first()
    const inDiet = 0 // knex('meals').count('is_diet').first()
    const offDiet = 0 // knex('meals').count('is_diet').first()
    const bestSequenceOfDay = 0 // knex('meals').count(
    //   knex.raw('??', ['create_at', 'is_diet']),
    // )

    return reply.status(200).send({
      count,
      inDiet,
      offDiet,
      bestSequenceOfDay,
    })
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    })

    const { name, description, isDiet } = createMealBodySchema.parse(
      request.body,
    )

    const sessionId = request.cookies.session_id

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_diet: isDiet,
      create_at: new Date().toString(),
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
      })

      const getMealParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamSchema.parse(request.params)
      const sessionId = request.cookies.session_id

      const mealFinded = await knex('meals').where({ id }).first()

      if (!mealFinded) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      const { name, description, isDiet } = updateMealBodySchema.parse(
        request.body,
      )

      await knex('meals').where({ id, session_id: sessionId }).update({
        name,
        description,
        is_diet: isDiet,
      })
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamSchema.parse(request.params)

      await knex('meals').where({ id }).delete()
    },
  )
}
