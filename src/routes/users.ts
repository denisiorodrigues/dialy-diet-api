import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createUserBodySchema.parse(request.body)

    const sessionId = randomUUID()

    await knex('users').insert({
      id: randomUUID(),
      name,
      session_id: sessionId,
      create_at: new Date().toString(),
    })

    return reply.status(201).send()
  })

  app.get('/', async (request, reply) => {
    const users = await knex('users').select('*')
    return { users }
  })

  app.get('/:id', async (request, reply) => {
    const getUserParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamSchema.parse(request.params)

    const user = await knex('users').where({ id }).first('*')

    return { user }
  })

  app.get('/login/:id', async (request, reply) => {
    const getUserParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamSchema.parse(request.params)

    const user = await knex('users').where({ id }).first('*')

    reply.cookie('sessionId', user.session_id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(204).send()
  })
}
