const express = require('express')
const router = express.Router()

const {
	create,
	read,
	remove,
	update,
	getAll,
} = require('../controllers/controller.product')
const {
	userById,
	requireSignin,
	isAuth,
	isAdmin,
} = require('../middleware/auth')

const { productById } = require('../middleware/product')

router.get('/:productId', read)
router.get('/', getAll)
router.post('/create/:userId', requireSignin, isAuth, isAdmin, create)
router.delete('/:productId/:userId', requireSignin, isAuth, isAdmin, remove)
router.put('/:productId/:userId', requireSignin, isAuth, isAdmin, update)
router.param('userId', userById)
router.param('productId', productById)
module.exports = router
