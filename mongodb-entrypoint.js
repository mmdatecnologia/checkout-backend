/* eslint-disable no-undef */
db = db.getSiblingDB('checkout')
db.createUser({
  user: 'mongo',
  pwd: 'mongo',
  roles: [
    {
      role: 'dbOwner',
      db: 'checkout'
    }
  ]
})
