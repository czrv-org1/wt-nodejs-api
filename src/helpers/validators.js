const {handle} = require('../../errors')
function validatePasswords (req, res, next) {
  const { password, newPassword } = req.body
  if (!password) return next(handle('missingPassword', new Error()))
  if (!newPassword) return next(handle('missingNewPassword', new Error()))

  next()
}

function validatePassword (req, res, next) {
  const { password } = req.body
  if (!password) return next(handle('missingPassword', new Error()))
  next()
}

function validateCreateHotel (req, res, next) {
  const { password, name, description } = req.body
  if (!password) return next(handle('missingPassword', new Error()))
  if (!name) return next(handle('createHotel', new Error()))
  if (!description) return next(handle('createHotel', new Error()))
  next()
}

function validateAddImage (req, res, next) {
  const { url } = req.body
  if (!url) return next(handle('missingUrl', new Error()))
  next()
}

module.exports = {
  validateAddImage,
  validateCreateHotel,
  validatePassword,
  validatePasswords
}
