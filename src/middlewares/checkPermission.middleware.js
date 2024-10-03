const {
  checkPermission14,
  checkPermission16,
  checkPermission15,
} = require('../auth/checkPermission')
const { BadRequestError, ForbiddenError } = require('../utils/error.response')

// Middleware để kiểm tra quyền
const checkUserRights14 = async (req, res, next) => {
  const { StocktradersRightsRequest } = req.body

  const user = StocktradersRightsRequest?.user

  if (!user) {
    return res.status(400).json({ message: 'Missing user information.' })
  }

  const hasPermission = await checkPermission14(user) // Kiểm tra quyền từ API

  if (hasPermission !== 1) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to access this resource.' })
  }

  next() // Nếu có quyền, cho phép truy cập
}

const checkUserRights15 = async (req, res, next) => {
  const { StocktradersRightsRequest } = req.body

  const user = StocktradersRightsRequest?.user

  if (!user) {
    return res.status(400).json({ message: 'Missing user information.' })
  }

  const hasPermission = await checkPermission15(user) // Kiểm tra quyền từ API

  if (hasPermission !== 1) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to access this resource.' })
  }

  next() // Nếu có quyền, cho phép truy cập
}

const checkUserRights16 = async (req, res, next) => {
  const { StocktradersRightsRequest } = req.body

  const user = StocktradersRightsRequest?.user

  if (!user) {
    return res.status(400).json({ message: 'Missing user information.' })
  }

  const hasPermission = await checkPermission16(user) // Kiểm tra quyền từ API

  if (hasPermission !== 1) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to access this resource.' })
  }

  next() // Nếu có quyền, cho phép truy cập
}

module.exports = {
  checkUserRights14,
  checkUserRights15,
  checkUserRights16,
}
