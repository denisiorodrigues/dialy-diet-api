import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'

export const app = fastify()

// Usar o cookie com fastify
app.register(fastifyCookie)

// Registrar as rotas
// app.register
