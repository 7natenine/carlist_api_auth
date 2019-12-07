const bcrypt = require('bcryptjs')

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      full_name: 'Test user 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      username: 'test-user-2',
      full_name: 'Test user 2',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      username: 'test-user-3',
      full_name: 'Test user 3',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      username: 'test-user-4',
      full_name: 'Test user 4',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeAdsArray(users) {
  return [
    {
      id: 1,
      make: 'Alfa Romeo',
      model: '4c',
      price: 30000,
      car_year: 2016,
      mileage: 43500,
      photos_link: 'link_here',
      author_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 2,
      make: 'BMW',
      model: 'i8',
      price: 50000,
      car_year: 2017,
      mileage: 32000,
      photos_link: 'link_here',
      author_id: users[1].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 3,
      make: 'Chevorlet',
      model: 'corvette',
      price: 35000,
      car_year: 2006,
      mileage: 55000,
      photos_link: 'link_here',
      author_id: users[2].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
  ]
}

function makeExpectedAd(users, Ad) {
  const author = users
    .find(user => user.id === Ad.author_id)

  return {
    id: Ad.id,
    style: Ad.style,
    title: Ad.title,
    content: Ad.content,
    date_created: Ad.date_created.toISOString(),

    author: {
      id: author.id,
      username: author.username,
      full_name: author.full_name,
      date_created: author.date_created.toISOString(),
      date_modified: author.date_modified || null,
    },
  }
}


function makeMaliciousAd(user) {
  const maliciousAd = {
    id: 911,
    style: 'How-to',
    date_created: new Date(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedAd = {
    ...makeExpectedAd([user], maliciousAd),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousAd,
    expectedAd,
  }
}

function makeAdsFixtures() {
  const testUsers = makeUsersArray()
  const testAds = makeAdsArray(testUsers)
  return { testUsers, testAds }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        carlist_Ads,
        carlist_users,
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE carlist_Ads_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE carlist_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('carlist_Ads_id_seq', 0)`),
        trx.raw(`SELECT setval('carlist_users_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) { 
  const preppedUsers = users.map(user => ({ 
    ...user, 
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('carlist_users').insert(preppedUsers)
    .then(() => {
      // update the auto sequence to stay in sync 
      db .raw(
        `select setval('carlist_users_id_seq',?)`,[users[users.length - 1].id]
      )
    })
}


function seedAdsTables(db, users, Ads) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('carlist_ads').insert(ads)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('carlist_ads_id_seq',?)`,
      [ads[ads.length - 1].id]
    )
  })
}

function seedMaliciousAd(db, user, Ad) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('carlist_Ads')
        .insert([Ad])
    )
}

function makeAuthHeader(user) {
  const token = buffer.froom(`${user.username}:${user.password}`).toString('base64')
  return `Basic ${token}`
}

module.exports = {
  makeUsersArray,
  makeAdsArray,
  makeExpectedAd,
  makeMaliciousAd,

  makeAdsFixtures,
  cleanTables,
  seedAdsTables,
  seedMaliciousAd,
  makeAuthHeader, 
  seedUsers,
}
