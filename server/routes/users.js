'use strict'

const express = require('express')
const router = express.Router()
let userDb

require('../scripts/db/tables')().then((dbs) => {
  ;({ userDb } = dbs)
})

router.post('/', async (req, res) => {
  if (!req.user) return res.sendStatus(401)
  const user = req.body
  userDb.storeUser(req.user, user)
  res.status(201).send()
})

router.get('/', async (req, res) => {
  if (!req.user) return res.sendStatus(401)
  let user = await userDb.getUser(req.user)
  res.send(user)
})

module.exports = router
