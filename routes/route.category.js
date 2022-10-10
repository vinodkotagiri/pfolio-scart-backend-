const express = require('express')
const router = express.Router()

const {
	create,
	read,
	update,
	remove,
	getAll,
} = require('../controllers/controller.category')

//Middleware
const {
	requireSignin,
	isAuth,
	isAdmin,
	userById,
} = require('../middleware/auth')
const { categoryById } = require('../middleware/category')

router.post('/create/:userId', requireSignin, isAuth, isAdmin, create)
router.get('/:categoryId', read)
router.get('/', getAll)
router.delete('/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove)
router.put('/:categoryId/:userId', requireSignin, isAuth, isAdmin, update)
router.param('userId', userById)
router.param('categoryId', categoryById)
module.exports = router
