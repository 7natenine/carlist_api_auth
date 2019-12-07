const knex = require ('knex')
const app = require('./app')
const { PORT, DB_URL } = require('./config')
const express = require('express')
// const knex = require('../knex/knex.js')

// app.get('/api/*', (req, res) => {
//   res.json({ok: true});
// });

const db = knex({
  client: 'pg', 
  connection: DB_URL, 
})

app.set('db',db)


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});

module.exports = {app};