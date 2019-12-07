const app = require('../src/app')
const knex = require('knex')
const helpers = require('./test-helpers')

// describe('App', () => {
//   it('Get / responds with 200 containing "Hello, world!"', () => {
//     return supertest(app)
//       .get('/')
//       .expect(200, 'Hello, world!')
//   })
// })

describe.only('Ad Endpoints', function() { 
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg', 
      connection: process.env.TEST_DB_URL,
    })
    app.set('db',db )
  })

  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db('carlist_ads').truncate())

  context('Given there are ads in the database',() => {
    const testAds = [
      {
        id: 1, 
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        make: 'Alfa Romeo',
        model: '4c',
        price: 30000,
        car_year: 2016,
        photos_link: 'link_here',
        mileage: 43500,
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
      },
      {
        id: 2, 
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        make: 'BMW',
        model: 'i8',
        price: 50000,
        car_year: 2017,
        photos_link: 'link_here',
        mileage: 32000,
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
      },
      {
        id: 3, 
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        make: 'Chevorlet',
        model: 'corvette',
        price: 35000,
        car_year: 2006,
        photos_link: 'link_here',
        mileage: 55000,
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
      },
    ];

    beforeEach('insert ads', () => {
      return db
        .into('carlist_ads')
        .insert(testAds)
    })

    it('GET /ads responds with 200 and all of the ads', () => {
      return supertest(app)
        .get('/ads')
        .expect(200, testAds)
    })

    it('GET /ads/:ads_id responds with 200 and the specified article', () => {
      const adId = 2 
      const expectedAd = testAd[adId - 1]
      return supertest(app)
        .get('/ads/${adId}')
        .expect(200, expectedAd)
    })
  })
  const { 
    testUsers, 
    testAds, 
  } = helpers.makeAdsFixtures()

// will have to edit to make it more secure
  function makeAuthHeader(user) { 
    const token = Buffer.from(`${user.username}:${user.password}`).toString('base64')
    return `basic ${token}`
  }

  before('make knex instance', () => {
    db = knex ({ 
      client: 'pg',
      connection: process.env.TEST_DB_URL, 
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db('carlist_ads').truncate())

  afterEach('cleanup', () => db('carlist_ads').truncate())



  // before('cleanup', () => helpers.cleanTables(db))

  // afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`Protected endpoints`, () => { 
    beforeEach('insert ads', () => 
      helpers.seedAdsTables(
        db, 
        testUsers, 
        testAds, 
      )
    )

    const protectedEndpoints = [
      { 
        name: 'GET /api/ads/:adId', 
        path: '/api/ads/1' 
      },
    ]

    protectedEndpoints.forEach(endpoint => { 
      describe(endpoint.name, () => {
        it(`responds with 401 'Missing basic token' when no basic token`, () => {
          return supertest(app)
            .get(endpoint.path)
            .expect(401, { error: `Missing basic token`})
        })

        it(`responds 401 'Unathorized request' when no credentials in token`, () => {
          const userNoCreds = { username: '',password: ''}
          return supertest(app)
          .get(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(UserNoCreds))
          .expect(401, { error:`Unauthorized request`})
        })

        it(`responds 401 'Unauthorized request' when invalid user`, () => { 
          const userInvalidCreds = { username: 'user-not', password: 'existy'}
          return supertest(app)
            .get(endpoint.path)
            .set('Authorization', makeAuthHeader(userInvalidCred))
            expect(401, {error: `Unauthorized request` })
        })

        it(`responds 401 'Unautorized request' when invalid password`, () => {
          const userInvalidPass = { username: testUsers[0].username, password: 'wrong' }
          return supertest(app)
            .get(endpoint.path)
            .set('Autorization', makeAuthHeader(userInvalidPass))
            .expect(401, { error: `Unauthorized request` })
        })
      })
    })
  })

  describe(`GET /api/ads`, () => {
    context(`Given no ads`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/ads')
          .expect(200, [])
      })
    })

    context('given there are ads in the database', () => {
      beforeEach('insert ads', () => 
        helpers.seedAdsTables(
          db, 
          testUsers, 
          testAds, 
        )
      )

      it('responds with 200 and all of the ads', () => {
        const expectedAds = testAdsmap(ads =>
          helpers.makeExpectedAds(
            testUsers,
            ads,
          )
        )
        return supertest(app)
          .get('/api/ads')
          .expect(200, expectedads)
      })
    })

    context(`Given an XSS attack ads`, () => {
      const testUsers = helpers.makeUsersArray()[1]
      const {
        maliciousAd,
        expectedAd,
      } = helpers.makeMaliciousAd(testUsers)

      beforeEach('insert malicious ad', () => {
        return helpers.seedMaliciousAd(
          db,
          testUsers,
          maliciousAd,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/ads`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].make).to.eql(expectedAd.make)
            expect(res.body[0].content).to.eql(expectedAd.content)
          })
      })
    })
  })

  describe(`GET /api/ads/:adId`, () => {
    context(`Given no ads`, () => {
      beforeEach(() => 
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const adId = 123456
        return supertest(app)
          .get(`/api/ads/${adId}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(404, { error: `ad doesn't exist` })
      })
    })

    context('Given there are ads in the database', () => {
      beforeEach('insert ads', () =>
        helpers.seedAdsTables(
          db,
          testUsers,
          testAds,
        )
      )

      it('responds with 200 and the specified ad', () => {
        const adId = 2
        const expectedad = helpers.makeExpectedad(
          testUsers,
          testAds[adId - 1],
        )

        return supertest(app)
          .get(`/api/ads/${adId}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200, expectedAd)
      })
    })


    context(`Given an XSS attack ad`, () => {
      const testUsers = helpers.makeUsersArray()[1]
      const {
        maliciousAd,
        expectedAd,
      } = helpers.makeMaliciousAd(testUsers)

      beforeEach('insert malicious ad', () => {
        return helpers.seedMaliciousAd(
          db,
          testUsers,
          maliciousAd,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/ads/${maliciousAd.id}`)
          .set('Authorization', makeAuthHeader(testUsers))
          .expect(200)
          .expect(res => {
            expect(res.body.make).to.eql(expectedAd.make)
            expect(res.body.content).to.eql(expectedAd.content)
          })
      })
    })
  }) 
  
  describe(`POST /ads`, () => {
    it(`creates an ad, responding with 201 and the new ad`,  function() {
      const newAd = {
        make: 'Alfa Romeo',
        model: 'Test new model',
        price: '30000',
        car_year: '2016',
        photos_link: 'link_here',
        mileage: '24000',
        content: 'test ad...'
     } 
      return supertest(app)
      .post('/ads')
      .send(newAd) 
      .expect(201)
      .expect(res => {
        expect(res.body.make).to.eql(newAd.make)
        expect(res.body.model).to.eql(newAd.model)
        expect(res.body.price).to.eql(newAd.price)
        expect(res.body.car_year).to.eql(newAd.car_year)
        expect(res.body.photos_link).to.eql(newAd.photos_link)
        expect(res.body.mileage).to.eql(newAd.mileage)
        expect(res.body).to.have.property('id')   
      })
    })
  })
})
