const express = require('express')
const router = express.Router()

const { create } = require('../controllers/controller.category')

//Middleware
const {
	requireSignin,
	isAuth,
	isAdmin,
	userById,
} = require('../middleware/auth')

router.post('/create/:userId', requireSignin, isAuth, isAdmin, create)
router.param('userId', userById)

module.exports = router
