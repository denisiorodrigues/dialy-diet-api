import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'
import { usersRoutes } from './routes/users'

export const app = fastify()

// Usar o cookie com fastify
app.register(fastifyCookie)

// Registrar as rotas
app.register(usersRoutes, { prefix: 'users' })
