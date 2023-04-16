import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
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
    await request(app.server)
      .post('/users')
      .send({
        name: 'Esteban Tavares',
      })
      .expect(201)
  })

  it('shold be able to list all user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Esteban Tavares',
      })
      .expect(201)

    const listUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    expect(listUsersResponse.body.users).toEqual([
      expect.objectContaining({
        name: 'Esteban Tavares',
      }),
    ])
  })

  it('shold be able to user can login', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Esteban Tavares',
      })
      .expect(201)

    const listUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    const userId = listUsersResponse.body.users[0].id

    await request(app.server).get(`/users/login/${userId}`).expect(204)
  })
})
