'use strict'

const express = require('express')
const router = express.Router()
let userDb

require('../scripts/db/tables')('./mongo-client').then((dbs) => {
  ;({ userDb } = dbs)
})

router.post('/', async (req, res) => {
  if (!req.user) return res.sendStatus(401)
  const user = req.body
  userDb.storeUser(req.user, user)
  res.sendStatus(201)
})

router.get('/', async (req, res) => {
  if (!req.user) return res.sendStatus(401)
  let user = await userDb.getUser(req.user)
  res.send(user)
})

module.exports = router
