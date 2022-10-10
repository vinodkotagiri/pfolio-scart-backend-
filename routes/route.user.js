const express = require('express')
const router = express.Router()
const User = require('../models/model.user')
const {
	requireSignin,
	userById,
	isAuth,
	isAdmin,
} = require('../middleware/auth')

const { listAll, read, update } = require('../controllers/controller.user')
router.get('/', listAll)
router.get('/:useId', requireSignin, isAuth, read)
router.put('/:useId', requireSignin, isAuth, update)
router.param('userId', userById)
module.exports = router
