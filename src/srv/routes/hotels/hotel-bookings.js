
const express = require('express')
const hotelBookingRouter = express.Router()
const { loadAccount } = require('../../../helpers/crypto')
const { validatePassword,
        validateRequired,
        validateReservationId } = require('../../../helpers/validators')
const { handle } = require('../../../../errors')
const HotelManager = require('../../../../wt-js-libs/dist/node/HotelManager.js')
const BookingData = require('../../../../wt-js-libs/dist/node/BookingData.js')

const config = require('../../../../config.js')

hotelBookingRouter.put('/hotels/:address/confirmation',
validatePassword, validateRequired, async(req, res, next) => {
  const { password, required } = req.body
  const { address } = req.params
  let ownerAccount = {}
  try {
    let context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    }
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.setRequireConfirmation(address, !!required)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

hotelBookingRouter.get('/hotels/:hotelAddress/bookings', async (req, res, next) => {
  const { block } = req.body
  const { hotelAddress } = req.params
  try {
    const data = new BookingData(config.get('web3'))
    const bookings = await data.getBookings(hotelAddress, block)
    res.status(200).json({bookings})
  } catch (err) {
    next(handle('web3', err))
  }
})

hotelBookingRouter.get('/hotels/:hotelAddress/requests',
async (req, res, next) => {
  const { block } = req.body
  const { hotelAddress } = req.params
  try {
    const data = new BookingData(config.get('web3'))
    const requests = await data.getBookingRequests(hotelAddress, block)
    res.status(200).json({requests})
  } catch (err) {
    next(handle('web3', err))
  }
})

hotelBookingRouter.post('/hotels/:address/confirmBooking',
validatePassword, validateReservationId,
async(req, res, next) => {
  const { password, reservationId } = req.body
  const { address } = req.params
  let ownerAccount = {}
  try {
    let context = {
      indexAddress: config.get('indexAddress'),
      gasMargin: config.get('gasMargin'),
      web3: config.get('web3')
    }
    ownerAccount = config.get('web3').eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password)
    context.owner = ownerAccount.address
    const hotelManager = new HotelManager(context)
    hotelManager.web3.eth.accounts.wallet.add(ownerAccount)
    const { logs } = await hotelManager.confirmBooking(address, reservationId)
    hotelManager.web3.eth.accounts.wallet.remove(ownerAccount)
    res.status(200).json({
      txHash: logs[0].transactionHash
    })
  } catch (err) {
    next(handle('web3', err))
  }
})

module.exports = {
  hotelBookingRouter
}
