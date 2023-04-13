import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { beforeEach } from 'node:test'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run kenx migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('shold be able to create a new meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'Café da amnhã',
        description: 'Café e torrada',
        isDiet: true,
      })
      .expect(201)
  })

  it('shold be able to list all meals', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Café da amnhã',
        description: 'Café e torrada',
        isDiet: true,
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Café da amnhã',
        description: 'Café e torrada',
        isDiet: true,
      }),
    ])
  })
})
