const express = require('express')
const router = express.Router()

const {
	create,
	read,
	remove,
	update,
	list,
	listRelated,
	listCategories,
	listBySearch,
} = require('../controllers/controller.product')
const {
	userById,
	requireSignin,
	isAuth,
	isAdmin,
} = require('../middleware/auth')

const { productById, getPhoto } = require('../middleware/product')

router.get('/:productId', read)
router.get('/', list)
router.post('/by/search', listBySearch)
router.get('/related/:productId', listRelated)
router.get('/categories/all', listCategories)
router.get('/photo/:productId', getPhoto)
router.post('/create/:userId', requireSignin, isAuth, isAdmin, create)
router.delete('/:productId/:userId', requireSignin, isAuth, isAdmin, remove)
router.put('/:productId/:userId', requireSignin, isAuth, isAdmin, update)

router.param('userId', userById)
router.param('productId', productById)
module.exports = router
