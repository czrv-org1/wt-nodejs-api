/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const fetch = require('node-fetch')
const config = require('../../../config.js')
const { AfterEach,
        BeforeEach,
        Before } = require('../../hooks.js')

describe('Units prices', function () {
  AfterEach()
  BeforeEach()
  Before()
  const defaultPrice = 78
  const defaultLifPrice = 2
  describe('Units Líf prices', function () {
    it('GET /units/:unitAdress/lifCosts. Expect 200', async () => {
      const days = 5
      const estimatedCost = defaultLifPrice * days
      const body = JSON.stringify({
        password: config.get('password'),
        days,
        from: new Date('10/10/2020')
      })
      let response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/lifCost`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })

      expect(response).to.have.property('status', 200)
      expect(await response.json()).to.have.property('cost', estimatedCost.toString())
    })
    it('POST /hotels/:address/units/:unit/defaultLifPrice. Expect 200', async () => {
      const price = 78
      const body = JSON.stringify({
        password: config.get('password'),
        price
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultLifPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.be.ok
      expect(response).to.have.property('status', 200)
      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })
      const { hotel } = await response.json()
      expect(hotel.units[config.get('unitAdress')]).to.have.property('defaultLifPrice', price)
    })
    it('POST /hotels/:address/units/:unit/defaultLifPrice. Expect 400 #missingPassword', async () => {
      const price = 78
      const body = JSON.stringify({
        price
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultLifPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.have.property('status', 400)
      const resp = await response.json()
      expect(resp).to.have.property('code', '#missingPassword')
    })
    it('POST /hotels/:address/units/:unit/defaultLifPrice. Expect 400 #missingPrice', async () => {
      const body = JSON.stringify({
        password: config.get('password')
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultLifPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.have.property('status', 400)
      const resp = await response.json()
      expect(resp).to.have.property('code', '#missingPrice')
    })
    it('POST /hotels/:address/units/:unit/specialLifPrice. Expect 200', async () => {
      const specialLifPrice = 70
      let body = JSON.stringify({
        password: config.get('password'),
        price: specialLifPrice,
        days: 1,
        from: new Date('10/10/2020')
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/specialLifPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.have.property('status', 200)
      body = JSON.stringify({
        date: Math.round(new Date('10/10/2020').getTime() / 86400000)
      })
      response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/reservation`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })
      expect(response).to.have.property('status', 200)
      const { reservation } = await response.json()
      expect(reservation).to.have.property('specialLifPrice', specialLifPrice.toString())
    })
    it('POST /hotels/:address/units/:unit/specialLifPrice. Expect 400 #missingPassword', async () => {
      const specialLifPrice = 70
      let body = JSON.stringify({
        price: specialLifPrice,
        days: 1,
        from: new Date('10/10/2020')
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/specialLifPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.have.property('status', 400)
      expect(await response.json()).to.have.property('code', '#missingPassword')
    })
    it('GET /balance. Expect 200', async () => {
      const body = JSON.stringify({
        cost: 27,
        account: config.get('user')
      })
      let response = await fetch(`http://localhost:3000/balance`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })

      expect(response).to.have.property('status', 200)
    })
  })
  describe('Units fiat prices', function () {
    it('GET /units/:unitAdress/costs. Expect 200', async () => {
      const days = 5
      const estimatedCost = defaultPrice * days
      const body = JSON.stringify({
        password: config.get('password'),
        days,
        from: new Date('10/10/2020')
      })
      let response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/cost`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })

      expect(response).to.have.property('status', 200)
      expect(await response.json()).to.have.property('cost', estimatedCost.toFixed(2))
    })
    it('GET /units/:unitAdress/costs. Expect 400 #missingDays', async () => {
      const body = JSON.stringify({
        password: config.get('password'),
        from: new Date('10/10/2020')
      })
      let response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/cost`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })

      expect(response).to.have.property('status', 400)
      expect(await response.json()).to.have.property('code', '#missingDays')
    })
    it('GET /units/:unitAdress/costs. Expect 400 #missingFrom', async () => {
      const body = JSON.stringify({
        password: config.get('password'),
        days: 5
      })
      let response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/cost`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })

      expect(response).to.have.property('status', 400)
      expect(await response.json()).to.have.property('code', '#missingFrom')
    })
    it('POST /hotels/:address/units/:unit/defaultPrice. Expect 200', async () => {
      const price = 78
      const body = JSON.stringify({
        password: config.get('password'),
        price
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.be.ok
      expect(response).to.have.property('status', 200)
      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })
      const { hotel } = await response.json()
      expect(hotel.units[config.get('unitAdress')]).to.have.property('defaultPrice', price.toFixed(2))
    })
    it('POST /hotels/:address/units/:unit/defaultPrice. Expect 400 #missingPassword', async () => {
      const price = 7
      const body = JSON.stringify({
        price
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.be.ok
      expect(response).to.have.property('status', 400)
      const res = await response.json()
      expect(res).to.have.property('code', '#missingPassword')
    })
    it('POST /hotels/:address/units/:unit/defaultPrice. Expect 400 ##missingPrice', async () => {
      const body = JSON.stringify({
        password: config.get('password')
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/defaultPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.be.ok
      expect(response).to.have.property('status', 400)
      const res = await response.json()
      expect(res).to.have.property('code', '#missingPrice')
    })
    it('POST /hotels/:address/units/:unit/currencyCode. Expect 200', async () => {
      const body = JSON.stringify({
        password: config.get('password'),
        code: 948
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/currencyCode`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.be.ok
      expect(response).to.have.property('status', 200)
      response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })
      const { hotel } = await response.json()
      expect(hotel.units[config.get('unitAdress')]).to.have.property('currencyCode', 'CHW')
    })
    it('POST /hotels/:address/units/:unit/currencyCode. Expect 400 #missingPassword', async () => {
      const body = JSON.stringify({
        code: 948
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/currencyCode`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.be.ok
      expect(response).to.have.property('status', 400)
      const resp = await response.json()
      expect(resp).to.have.property('code', '#missingPassword')
    })
    it('POST /hotels/:address/units/:unit/currencyCode. Expect 400 #missingCode', async () => {
      const body = JSON.stringify({
        password: config.get('password')
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/currencyCode`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.be.ok
      expect(response).to.have.property('status', 400)
      const resp = await response.json()
      expect(resp).to.have.property('code', '#missingCode')
    })
    it('POST /hotels/:address/units/:unit/specialPrice. Expect 200', async () => {
      const specialPrice = 70
      let body = JSON.stringify({
        password: config.get('password'),
        price: specialPrice,
        days: 1,
        from: new Date('10/10/2020')
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/specialPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.have.property('status', 200)
      body = JSON.stringify({
        date: Math.round(new Date('10/10/2020').getTime() / 86400000)
      })
      response = await fetch(`http://localhost:3000/units/${config.get('unitAdress')}/reservation`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        body
      })
      expect(response).to.have.property('status', 200)
      const { reservation } = await response.json()
      expect(reservation).to.have.property('specialPrice', specialPrice.toFixed(2))
    })
    it('POST /hotels/:address/units/:unit/specialPrice. Expect 400 #missingPassword', async () => {
      const specialPrice = 70
      let body = JSON.stringify({
        price: specialPrice,
        days: 1,
        from: new Date('10/10/2020')
      })
      let response = await fetch(`http://localhost:3000/hotels/${config.get('testAddress')}/units/${config.get('unitAdress')}/specialPrice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })
      expect(response).to.have.property('status', 400)
      expect(await response.json()).to.have.property('code', '#missingPassword')
    })
  })
})
