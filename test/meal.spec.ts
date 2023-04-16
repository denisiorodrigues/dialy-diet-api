import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
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
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('shold be able to create a new meal', async () => {
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

    const getUserLogingResponse = await request(app.server)
      .get(`/users/login/${userId}`)
      .expect(204)

    const cookies = getUserLogingResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Café da amnhã',
        description: 'Café e torrada',
        isDiet: true,
      })
      .expect(201)
  })

  it('shold be able to list all meals', async () => {
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

    const getUserLogingResponse = await request(app.server)
      .get(`/users/login/${userId}`)
      .expect(204)

    const cookies = getUserLogingResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Café da amnhã',
        description: 'Café e torrada',
        isDiet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    console.log(listMealsResponse.body)
    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Café da amnhã',
        description: 'Café e torrada',
      }),
    ])
  })

  it('shold be able to get a especific meal', async () => {
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

    const getUserLogingResponse = await request(app.server)
      .get(`/users/login/${userId}`)
      .expect(204)

    const cookies = getUserLogingResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Café da amnhã',
        description: 'Café e torrada',
        isDiet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals/')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Café da amnhã',
        description: 'Café e torrada',
      }),
    )
  })

  it('shold be able to delete a especific meal', async () => {
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

    const getUserLogingResponse = await request(app.server)
      .get(`/users/login/${userId}`)
      .expect(204)

    const cookies = getUserLogingResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Café da amnhã',
        description: 'Café e torrada',
        isDiet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals/')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)
  })
})
