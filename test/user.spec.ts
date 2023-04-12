import { afterAll, beforeAll, describe } from 'vitest'
import { app } from '../src/app'
import { beforeEach } from 'node:test'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('shold be able to create a new user', async () => {
    await request(app.server).post('/users').send({
      name: 'Esteban Tavares',
    })
  })
})
