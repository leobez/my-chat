const express = require('express')
const router = express.Router()

router.use('/api/user', require('./userRouter'))
router.use('/api/message', require('./messageRouter'))
router.use('/api/friendship', require('./friendshipRouter'))
router.use('/api/group', require('./groupRouter'))
router.use('/api/request', require('./userGroupRouter'))

// TEST ROUTE
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'api running'
    })
}) 

// 404 ROUTE
router.get('*', (req, res) => {
    res.status(404).json({
        message: 'not found'
    })
})


module.exports = router